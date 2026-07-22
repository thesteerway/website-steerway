"use client";

import { useState } from "react";
import { FAQS, FAQ_VISIBLE } from "@/lib/internal";

/**
 * The FAQ console: buyer questions the rest of the site does not answer,
 * as quiet accordion rows. The first FAQ_VISIBLE are listed; the rest wait
 * behind "view all". One question open at a time; the lighthouse beam
 * passing behind is the only decoration this section needs.
 */
export default function FaqConsole() {
  const [open, setOpen] = useState<number | null>(null);
  const [all, setAll] = useState(false);

  const shown = all ? FAQS : FAQS.slice(0, FAQ_VISIBLE);

  return (
    <section className="faqs" id="faqs" aria-label="Frequently asked questions">
      <header className="faqs-head">
        <h2 className="faqs-title">Asked often. Answered once, properly.</h2>
      </header>

      <ul className="faqs-list">
        {shown.map((f, i) => (
          <li className={`faq${open === i ? " is-open" : ""}`} key={f.q}>
            <button
              className="faq-q"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="faq-q-text">{f.q}</span>
              <span className="faq-toggle" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
            <div className="faq-a">
              <p className="faq-a-inner">{f.a}</p>
            </div>
          </li>
        ))}
      </ul>

      {!all && FAQS.length > FAQ_VISIBLE && (
        <button className="faq-more mono" onClick={() => setAll(true)}>
          View all {FAQS.length} questions
        </button>
      )}
    </section>
  );
}
