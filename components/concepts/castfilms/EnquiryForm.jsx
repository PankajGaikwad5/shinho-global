"use client";

import { useState } from "react";
import { GROUPS, AUTOMOTIVE } from "@/lib/cast";

// Short enquiry form, as the client's 15 Nov brief asks: name, company, business email and request.
// Quantity and the specification upload are optional. Nothing is sent by mailto, so no address appears
// in the page source — it posts to /api/enquiry, which routes privately (see that file).
const FILMS = [...GROUPS.map((g) => g.name), AUTOMOTIVE.name];

const field = "w-full border-0 border-b border-bone/25 bg-transparent py-3 text-[17px] text-bone outline-none transition-colors placeholder:text-bone/30 focus:border-brass";
const label = "font-mono text-[10px] uppercase tracking-[.16em] text-ash";

function Chip({ on, children, ...p }) {
  return (
    <button type="button" aria-pressed={on} {...p}
      className={`rounded-full border px-4 py-2 text-[13px] transition-colors duration-300 ${on ? "border-brass bg-brass text-ink" : "border-bone/25 text-bone/80 hover:border-bone/60"}`}>
      {children}
    </button>
  );
}

export default function CastEnquiryForm() {
  const [films, setFilms] = useState([]);
  const [state, setState] = useState("idle");   // idle | sending | sent | error
  const [error, setError] = useState("");

  const toggle = (name) => setFilms((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));

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
          request: f.get("request"), quantity: f.get("quantity"), films,
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
      <div className="flex min-h-[380px] flex-col justify-center gap-5 border border-bone/15 p-10">
        <span className="font-mono text-[11px] uppercase tracking-[.16em] text-brass">Enquiry received</span>
        <p className="text-[clamp(24px,2.4vw,34px)] leading-[1.12] font-medium [font-stretch:112%]">Thank you — a specialist will come back to you about samples and specification.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
      <label className="flex flex-col gap-1"><span className={label}>Name</span><input required name="name" autoComplete="name" className={field} /></label>
      <label className="flex flex-col gap-1"><span className={label}>Company</span><input required name="company" autoComplete="organization" className={field} /></label>
      <label className="flex flex-col gap-1 sm:col-span-2"><span className={label}>Business email</span><input required type="email" name="email" autoComplete="email" className={field} /></label>

      <fieldset className="flex flex-col gap-3 sm:col-span-2">
        <legend className={`${label} mb-3`}>Films of interest <span className="normal-case tracking-normal text-dusk">(optional)</span></legend>
        <div className="flex flex-wrap gap-2">{FILMS.map((n) => <Chip key={n} on={films.includes(n)} onClick={() => toggle(n)}>{n}</Chip>)}</div>
      </fieldset>

      <label className="flex flex-col gap-1 sm:col-span-2"><span className={label}>Your request</span>
        <textarea required name="request" rows={3} placeholder="The application, and whether you would like samples or a quotation." className={`${field} resize-none`} />
      </label>

      <label className="flex flex-col gap-1"><span className={label}>Quantity <span className="normal-case tracking-normal text-dusk">(optional)</span></span>
        <input name="quantity" placeholder="If you already know it" className={field} />
      </label>
      <label className="flex flex-col gap-1"><span className={label}>Specification <span className="normal-case tracking-normal text-dusk">(optional)</span></span>
        <input type="file" name="spec" className={`${field} text-[13px] file:mr-3 file:border-0 file:bg-bone/10 file:px-3 file:py-1.5 file:text-[12px] file:text-bone`} />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-6 sm:col-span-2">
        <span className="max-w-[340px] text-[13px] leading-[1.6] text-ash">
          {state === "error" ? <span className="text-[#d4473a]">{error}</span> : "Your details are used only to respond to this enquiry."}
        </span>
        <button type="submit" disabled={state === "sending"}
          className="group inline-flex items-center gap-4 rounded-full bg-bone px-8 py-4 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-brass disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Send enquiry"} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </form>
  );
}
