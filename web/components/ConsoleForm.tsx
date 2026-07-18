"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import ArrowUpRight from "@/components/ArrowUpRight";
import { CONTACT, LOCALE } from "@/lib/internal";

/**
 * The Console: the brief form as an instrument. Structured selects (what you
 * need, timeline, a draggable budget) compose a draft so nobody faces a blank
 * textarea, whose placeholder cycles real example briefs. A live route preview
 * lights as the brief becomes sendable; on submit the traveler square detaches
 * from the button, flies into the route's first dot, and the console prints a
 * receipt. No backend yet: submit composes a mail to the studio inbox.
 */
export default function ConsoleForm() {
  const [values, setValues] = useState({ name: "", email: "", company: "", brief: "" });
  const [need, setNeed] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState(0);
  const [userEdited, setUserEdited] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [honey, setHoney] = useState("");
  const [exampleI, setExampleI] = useState(0);
  const squareRef = useRef<HTMLSpanElement>(null);
  const dot1Ref = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // rotate the textarea example placeholder so the blank never stares back
  useEffect(() => {
    const id = window.setInterval(
      () => setExampleI((i) => (i + 1) % CONTACT.examples.length),
      4200
    );
    return () => window.clearInterval(id);
  }, []);

  const fmtBudget = (v: number) =>
    v <= CONTACT.budget.min
      ? "Not sure yet"
      : v >= CONTACT.budget.max
        ? `$${CONTACT.budget.max.toLocaleString()}+`
        : `$${v.toLocaleString()}`;

  const compose = (n: string, t: string, b: number) => {
    const parts: string[] = [];
    if (n) parts.push(`We need: ${n}.`);
    if (t) parts.push(`Timeline: ${t}.`);
    if (b > 0) parts.push(`Rough budget: ${fmtBudget(b)}.`);
    return parts.join(" ");
  };

  const recompose = (n: string, t: string, b: number) => {
    if (!userEdited) setValues((v) => ({ ...v, brief: compose(n, t, b) }));
  };

  const emailOk = /.+@.+\..+/.test(values.email);
  const briefOk = values.brief.trim().length > 0 || need !== "";
  const ready = briefOk && values.name.trim().length > 0 && emailOk;

  // Lazarev-style floating CTA: once the brief is sendable, a small bubble
  // trails the cursor with inertia, nudging you to send.
  useEffect(() => {
    if (!ready || sent) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = bubbleRef.current;
    if (!el) return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let seen = false;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        seen = true;
        x = tx;
        y = ty;
      }
    };
    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      el.style.transform = `translate(${x}px, ${y}px) translate(1.2rem, 1.2rem)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [ready, sent]);

  const status = sent
    ? CONTACT.status.sent
    : ready
      ? CONTACT.status.ready
      : briefOk || values.name
        ? CONTACT.status.typing
        : CONTACT.status.idle;

  const stamp = useMemo(
    () => new Date().toISOString().slice(0, 16).replace("T", " "),
    [sent] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const flySquare = () => {
    const sq = squareRef.current;
    const dot = dot1Ref.current;
    if (sq && dot && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const a = sq.getBoundingClientRect();
      const b = dot.getBoundingClientRect();
      const fly = sq.cloneNode(true) as HTMLElement;
      fly.className = "console-fly";
      fly.style.left = `${a.left + a.width / 2}px`;
      fly.style.top = `${a.top + a.height / 2}px`;
      document.body.appendChild(fly);
      gsap.to(fly, {
        left: b.left + b.width / 2,
        top: b.top + b.height / 2,
        scale: 0.6,
        duration: 0.9,
        ease: "power2.inOut",
        onComplete: () => fly.remove(),
      });
    }
  };

  /** last resort: compose the brief in the visitor's own mail app */
  const mailtoFallback = () => {
    const subject = encodeURIComponent(`Project brief from ${values.name}`);
    const body = encodeURIComponent(
      `Name: ${values.name}\nEmail: ${values.email}\nCompany: ${values.company}\n` +
        `Need: ${need || "(unspecified)"}\nTimeline: ${timeline || "(unspecified)"}\n` +
        `Budget: ${fmtBudget(budget)}\n\nThe brief:\n${values.brief}`
    );
    window.location.href = `mailto:${LOCALE.email}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ready || sending) return;
    setSending(true);
    flySquare();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          company: values.company,
          need,
          timeline,
          budget: fmtBudget(budget),
          brief: values.brief,
          website: honey, // honeypot: humans leave it empty
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.fallback) mailtoFallback();
        else if (res.status === 429) {
          setSending(false);
          return; // rate limited: keep the form so nothing is lost
        } else mailtoFallback();
      }
    } catch {
      mailtoFallback();
    }
    setSent(true);
    setSending(false);
  };

  const set =
    (k: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (k === "brief") setUserEdited(true);
      setValues((v) => ({ ...v, [k]: e.target.value }));
    };

  return (
    <div className="console-grid">
      {sent ? (
        <div className="console-receipt mono" role="status">
          <p>TRANSMISSION RECEIPT</p>
          <p>&gt; from: {values.name}</p>
          <p>&gt; brief: filed {stamp} UTC</p>
          <p>&gt; route: brief -&gt; review -&gt; next step</p>
          <p>&gt; reply: within one working day</p>
          <p className="console-receipt-note">
            Your brief is on its way to {LOCALE.email}. If your mail app
            opened instead, just send the prefilled email.
          </p>
        </div>
      ) : (
        <form className="console cform" onSubmit={onSubmit}>
          {/* honeypot: visually hidden, tab-skipped; bots fill it, humans never see it */}
          <input
            type="text"
            name="website"
            value={honey}
            onChange={(e) => setHoney(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              width: 1,
              height: 1,
              opacity: 0,
            }}
          />
          <div className="cform-row">
            <label className="cform-field">
              <span className="cform-label mono">&gt; {CONTACT.form.name}</span>
              <input
                name="name"
                type="text"
                required
                autoComplete="name"
                value={values.name}
                onChange={set("name")}
              />
            </label>
            <label className="cform-field">
              <span className="cform-label mono">&gt; {CONTACT.form.email}</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                value={values.email}
                onChange={set("email")}
              />
            </label>
          </div>

          <label className="cform-field">
            <span className="cform-label mono">&gt; {CONTACT.form.company}</span>
            <input
              name="company"
              type="text"
              autoComplete="organization"
              value={values.company}
              onChange={set("company")}
            />
          </label>

          <div className="cform-field">
            <span className="cform-label mono">&gt; {CONTACT.need.label}</span>
            <div className="cform-chips" role="radiogroup" aria-label={CONTACT.need.label}>
              {CONTACT.need.options.map((o) => (
                <button
                  type="button"
                  key={o}
                  role="radio"
                  aria-checked={need === o}
                  className={`cform-chip${need === o ? " is-on" : ""}`}
                  onClick={() => {
                    const next = need === o ? "" : o;
                    setNeed(next);
                    recompose(next, timeline, budget);
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <label className="cform-field cform-select cform-select--narrow">
            <span className="cform-label mono">&gt; {CONTACT.timeline.label}</span>
            <select
              value={timeline}
              onChange={(e) => {
                setTimeline(e.target.value);
                recompose(need, e.target.value, budget);
              }}
            >
              <option value="" disabled>
                {CONTACT.timeline.placeholder}
              </option>
              {CONTACT.timeline.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>

          <div className="cform-field cform-budget">
            <span className="cform-label mono">
              &gt; {CONTACT.budget.label}
              <span className="cform-budget-value">{fmtBudget(budget)}</span>
            </span>
            <input
              className="cform-range"
              type="range"
              min={CONTACT.budget.min}
              max={CONTACT.budget.max}
              step={CONTACT.budget.step}
              value={budget}
              onChange={(e) => {
                const b = Number(e.target.value);
                setBudget(b);
                recompose(need, timeline, b);
              }}
              style={{ "--fill": `${(budget / CONTACT.budget.max) * 100}%` } as CSSProperties}
              aria-label={CONTACT.budget.label}
            />
            <span className="cform-hint mono">{CONTACT.budget.note}</span>
          </div>

          <label className="cform-field">
            <span className="cform-label mono">&gt; {CONTACT.form.brief}</span>
            <textarea
              name="brief"
              rows={4}
              required
              placeholder={`e.g. ${CONTACT.examples[exampleI]}`}
              value={values.brief}
              onChange={set("brief")}
            />
          </label>

          <button
            className="btn btn--primary cform-submit console-submit"
            type="submit"
            disabled={!ready || sending}
          >
            <span className="console-square" ref={squareRef} aria-hidden="true" />
            {sending ? "Sending..." : CONTACT.form.submit}
            <ArrowUpRight />
          </button>
        </form>
      )}

      <aside className="console-route" aria-label="What happens next">
        <p className="console-status mono">
          {status}
          <span className="room-caret" />
        </p>
        <ol className="console-dots">
          {CONTACT.route.map((r, i) => {
            const lit = sent ? true : i === 0 ? briefOk : i === 1 ? ready : false;
            return (
              <li key={r.label} className={`console-dot-row${lit ? " is-lit" : ""}`}>
                <span className="console-dot" ref={i === 0 ? dot1Ref : undefined} />
                <span className="console-dot-label mono">{r.label}</span>
                <span className="console-dot-note">{r.note}</span>
              </li>
            );
          })}
        </ol>
      </aside>

      {ready && !sent && (
        <div className="console-cta-bubble" ref={bubbleRef} aria-hidden="true">
          send it
          <ArrowUpRight />
        </div>
      )}
    </div>
  );
}
