"use client";
import { useState } from "react";
import { SUBJECTS } from "@/data/schemas";
import { contactSchema } from "@/lib/contact-schema";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const field = "w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm placeholder:text-muted/70 focus:border-accent focus:outline-none";

export function ContactForm() {
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]>(SUBJECTS[0]);
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget; // currentTarget is null after the first await
    const form = new FormData(formEl);
    const parsed = contactSchema.safeParse({ name: form.get("name"), email: form.get("email"), subject, message: form.get("message"), website: form.get("website") ?? "" });
    if (!parsed.success) { setState({ kind: "error", message: parsed.error.issues[0]?.message ?? "Check the form." }); return; }
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(parsed.data) });
      if (res.ok) { setState({ kind: "sent" }); formEl.reset(); return; }
      const j = await res.json().catch(() => ({}));
      setState({ kind: "error", message: j.error ?? "Couldn't send. Email me directly." });
    } catch {
      setState({ kind: "error", message: "Network error. Email me directly or use WhatsApp." });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card relative p-6 md:p-8">
      <fieldset>
        <legend className="label text-muted">I&apos;d like to talk about…</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUBJECTS.map(s => (
            <label key={s} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors ${subject === s ? "border-accent text-fg" : "border-line text-muted hover:text-fg"}`}>
              <input type="radio" name="subject" value={s} checked={subject === s} onChange={() => setSubject(s)} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div><label htmlFor="name" className="label text-muted">Name</label><input id="name" name="name" autoComplete="name" required className={`${field} mt-2`} placeholder="Your name" /></div>
        <div><label htmlFor="email" className="label text-muted">Email</label><input id="email" name="email" type="email" autoComplete="email" required className={`${field} mt-2`} placeholder="you@company.com" /></div>
      </div>
      <div className="mt-4"><label htmlFor="message" className="label text-muted">Message</label><textarea id="message" name="message" rows={5} required className={`${field} mt-2`} placeholder="What are you building, when do you need it, and what does success look like?" /></div>
      <div className="absolute -left-[9999px]" aria-hidden><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button type="submit" disabled={state.kind === "sending"} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-ink shadow-[0_12px_32px_-12px_var(--color-accent-glow)] disabled:opacity-60">
          {state.kind === "sending" ? "Sending…" : state.kind === "sent" ? "Sent ✓" : "Send message ↵"}
        </button>
        <p className="label text-muted">Sent via Resend · no newsletter, ever</p>
      </div>
      {state.kind === "error" && <p role="alert" className="mt-4 text-sm text-fg">{state.message}</p>}
      {state.kind === "sent" && <p role="status" className="mt-4 text-sm text-fg">Sent. I&apos;ll reply within a day.</p>}
    </form>
  );
}
