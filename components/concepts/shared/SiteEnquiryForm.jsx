"use client";

import { useState } from "react";

// The enquiry form for the real site. One form, used by every page and by /request-samples.
//
// Fields are the client's 15 Nov brief: name, company, business email and the request. Quantity and the
// specification upload are optional, and `interests` adds an optional row of whatever the page is about.
// The long concept form (shared/EnquiryForm.jsx) also asked for role, markets and annual volume; the brief
// asks for a short form. That form stays where it is for the frozen concept pages — do not point the real
// pages back at it.
//
// It posts to /api/enquiry. It must never be a mailto: — that puts the destination address back in the
// page source, which the client asked us not to do.
//
// THE LOOK IS V1'S, and only V1's. The form is a stack of hairline rows: a mono micro-label in a fixed
// left column, the answer in large type on the right, a rule under each one that goes brass while the row
// has focus. That is the same row the menu, the About list and the supply-route list are built from.
// Interests are "+ name" / "— name" text toggles, exactly as Layers.jsx marks its two routes.
//
// What this replaced, and why — the client called it AI slop and he was right:
//   · numbered "01 Who you are / 02 What you need" group headings — form-wizard furniture, not V1.
//   · rounded pill chips — a component from nowhere; V1 has no pills except its one button.
//   · a translucent bordered card with backdrop-blur floating over the section's video, which left every
//     field sitting on moving city lights and unreadable. The form now sits on its own ground.
//
// No <fieldset>/<legend> anywhere: Preflight is off site-wide (to keep /original exact) and the .concept
// reset does not cover them, so the browser's own groove border and notched legend draw a box round the
// group. Use a div with role="group" instead.

const ROW = "grid grid-cols-1 gap-x-8 gap-y-2 border-t border-bone/15 py-6 transition-colors duration-300 focus-within:border-brass sm:grid-cols-[150px_1fr] sm:items-baseline";
const KEY = "font-mono text-[10px] uppercase tracking-[.16em] text-ash";
const INPUT = "w-full border-0 bg-transparent p-0 text-[clamp(18px,1.6vw,22px)] [font-family:inherit] font-medium [font-stretch:112%] text-bone outline-none placeholder:font-normal placeholder:[font-stretch:100%] placeholder:text-bone/20";

function Row({ k, hint, children }) {
  return (
    <label className={ROW}>
      <span className={KEY}>{k}{hint && <span className="normal-case tracking-normal text-dusk"> ({hint})</span>}</span>
      {children}
    </label>
  );
}

export default function SiteEnquiryForm({ interests = [], interestLabel = "Materials", requestPlaceholder = "The application, the performance you need, and whether you would like samples or a quotation." }) {
  const [picked, setPicked] = useState([]);
  const [state, setState] = useState("idle");   // idle | sending | sent | error
  const [error, setError] = useState("");

  const toggle = (name) => setPicked((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));

  const onSubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending"); setError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"), company: f.get("company"), email: f.get("email"),
          request: f.get("request"), quantity: f.get("quantity"), films: picked,
        }),
      });
      const out = await res.json();
      if (!res.ok || !out.ok) { setError(out.error || "Something went wrong. Please try again."); setState("error"); return; }
      setState("sent");
    } catch {
      setError("Could not send just now. Please try again."); setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="flex min-h-[340px] flex-col justify-center gap-6 border-t border-bone/15 pt-10">
        <span className="font-mono text-[11px] uppercase tracking-[.16em] text-brass">Enquiry received</span>
        <p className="max-w-[22ch] text-[clamp(30px,3.6vw,56px)] leading-[1.02] font-medium [font-stretch:115%] tracking-[-.03em] text-bone">
          Thank you. A specialist will come back to you.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <Row k="Name"><input required name="name" autoComplete="name" className={INPUT} /></Row>
      <Row k="Company"><input required name="company" autoComplete="organization" className={INPUT} /></Row>
      <Row k="Email"><input required type="email" name="email" autoComplete="email" className={INPUT} /></Row>

      {interests.length > 0 && (
        <div className={ROW}>
          <span className={KEY} id="enq-int">{interestLabel}<span className="normal-case tracking-normal text-dusk"> (optional)</span></span>
          {/* Text toggles with the +/— marker the supply-route rows use — not pills. */}
          <div role="group" aria-labelledby="enq-int" className="flex flex-wrap gap-x-7 gap-y-3">
            {interests.map((n) => {
              const on = picked.includes(n);
              return (
                <button key={n} type="button" aria-pressed={on} onClick={() => toggle(n)}
                  className="group flex items-baseline gap-2.5 text-left text-[clamp(15px,1.3vw,18px)] [font-stretch:110%] transition-colors duration-300"
                  style={{ color: on ? "var(--color-brass)" : "rgba(242,239,233,.72)" }}>
                  <span className="font-mono text-[11px] text-brass">{on ? "—" : "+"}</span>
                  <span className="transition-transform duration-500 ease-cine group-hover:translate-x-1">{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Row k="Request">
        <textarea required name="request" rows={3} placeholder={requestPlaceholder} className={`${INPUT} resize-none leading-[1.45]`} />
      </Row>
      <Row k="Quantity" hint="optional">
        <input name="quantity" placeholder="If you already know it" className={INPUT} />
      </Row>
      <Row k="Specification" hint="optional">
        <input type="file" name="spec"
          className="w-full border-0 bg-transparent p-0 text-[13px] [font-family:inherit] text-ash outline-none file:mr-4 file:border-0 file:bg-bone/10 file:px-4 file:py-2 file:text-[11px] file:[font-family:inherit] file:tracking-[.14em] file:text-bone file:uppercase" />
      </Row>

      <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6 border-t border-bone/15 pt-8">
        <span className="max-w-[34ch] text-[13px] leading-[1.6] text-ash" role={state === "error" ? "alert" : undefined}>
          {state === "error" ? <span className="text-[#d4473a]">{error}</span> : "Your details are used only to respond to this enquiry."}
        </span>
        <button type="submit" disabled={state === "sending"}
          className="group inline-flex items-center gap-4 rounded-full bg-bone px-8 py-4 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-brass disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Send enquiry"}
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </form>
  );
}
