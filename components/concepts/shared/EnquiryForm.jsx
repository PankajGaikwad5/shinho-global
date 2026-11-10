"use client";

import { useState } from "react";
import { FAMILIES, EMAIL } from "@/lib/brief";

const TYPES = ["OEM supply", "Materials sourcing", "Distribution partnership", "Other"];
const VOLUMES = ["Sampling / development", "< 10,000 m² per year", "10,000 – 100,000 m² per year", "> 100,000 m² per year", "Not sure yet"];

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

// B2B enquiry form. Concept only: no backend yet — submitting opens a pre-filled email.
// To go live, replace the mailto in onSubmit with a POST to a route handler / CRM.
// `types` / `interests` default to the original concept options (V1–V3).
export default function EnquiryForm({ types = TYPES, interests = FAMILIES.map((f) => f.name) }) {
  const [type, setType] = useState(types[0]);
  const [interest, setInterest] = useState([]);
  const [sent, setSent] = useState(false);

  const toggle = (name) => setInterest((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));

  const onSubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Name: ${f.get("name")}`, `Company: ${f.get("company")}`, `Role: ${f.get("role")}`, `Email: ${f.get("email")}`,
      `Markets: ${f.get("markets")}`, `Enquiry type: ${type}`, `Product interest: ${interest.join(", ") || "—"}`,
      `Annual volume: ${f.get("volume")}`, "", `${f.get("message")}`,
    ].join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`${type} enquiry — ${f.get("company")}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex min-h-[420px] flex-col justify-center gap-5 border border-bone/15 p-10">
        <span className="font-mono text-[11px] uppercase tracking-[.16em] text-brass">Enquiry prepared</span>
        <p className="text-[clamp(26px,2.6vw,38px)] leading-[1.1] font-medium [font-stretch:112%]">Your email app has opened with the details. Send it and a specialist will come back to you.</p>
        <button onClick={() => setSent(false)} className="self-start border-b border-bone pb-1 text-sm font-medium">Edit enquiry</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
      <label className="flex flex-col gap-1"><span className={label}>Full name</span><input required name="name" autoComplete="name" className={field} /></label>
      <label className="flex flex-col gap-1"><span className={label}>Company</span><input required name="company" autoComplete="organization" className={field} /></label>
      <label className="flex flex-col gap-1"><span className={label}>Role</span><input name="role" autoComplete="organization-title" placeholder="e.g. Purchasing, Product development" className={field} /></label>
      <label className="flex flex-col gap-1"><span className={label}>Business email</span><input required type="email" name="email" autoComplete="email" className={field} /></label>

      <fieldset className="flex flex-col gap-3 sm:col-span-2">
        <legend className={`${label} mb-3`}>Nature of enquiry</legend>
        <div className="flex flex-wrap gap-2">{types.map((t) => <Chip key={t} on={type === t} onClick={() => setType(t)}>{t}</Chip>)}</div>
      </fieldset>
      <fieldset className="flex flex-col gap-3 sm:col-span-2">
        <legend className={`${label} mb-3`}>Product interest</legend>
        <div className="flex flex-wrap gap-2">{interests.map((n) => <Chip key={n} on={interest.includes(n)} onClick={() => toggle(n)}>{n}</Chip>)}</div>
      </fieldset>

      <label className="flex flex-col gap-1"><span className={label}>Markets you sell into</span><input name="markets" placeholder="e.g. EU, North America" className={field} /></label>
      <label className="flex flex-col gap-1"><span className={label}>Estimated volume</span>
        <select name="volume" defaultValue={VOLUMES[0]} className={`${field} cursor-pointer [&>option]:bg-char`}>
          {VOLUMES.map((v) => <option key={v}>{v}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1 sm:col-span-2"><span className={label}>Application &amp; requirements</span>
        <textarea name="message" rows={3} placeholder="Substrate, process, performance requirements, timeline…" className={`${field} resize-none`} />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-6 sm:col-span-2">
        <span className="max-w-[340px] text-[13px] leading-[1.6] text-ash">Your details are used only to respond to this enquiry.</span>
        <button type="submit" className="group inline-flex items-center gap-4 rounded-full bg-bone px-8 py-4 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-brass">
          Send enquiry <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </form>
  );
}
