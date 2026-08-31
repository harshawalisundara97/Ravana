"use client";
import { useState } from "react";

const TOPICS = ["General enquiry", "Buying & escrow", "Selling & verification", "Disputes", "Press"];

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState(TOPICS[0]);

  if (sent) {
    return (
      <div className="p-5 max-w-[520px]" style={{ border: "2px solid var(--color-accent)" }}>
        <div className="font-heading font-extrabold text-[19px] mb-2">Message sent</div>
        <div className="text-[13px] leading-relaxed opacity-80">We reply within one business day. For urgent order or escrow issues, use the in-app dispute flow — it reaches us faster.</div>
      </div>
    );
  }

  return (
    <form
      className="grid grid-cols-2 gap-4 max-w-[640px]"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="field">
        <label>Name</label>
        <input className="input" required />
      </div>
      <div className="field">
        <label>Email</label>
        <input className="input" type="email" required />
      </div>
      <div className="field" style={{ gridColumn: "1/-1" }}>
        <label>Topic</label>
        <select className="input" value={topic} onChange={(e) => setTopic(e.target.value)}>
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="field" style={{ gridColumn: "1/-1" }}>
        <label>Message</label>
        <textarea className="input" required />
      </div>
      <button type="submit" className="btn btn-primary" style={{ gridColumn: "1/-1", justifySelf: "start" }}>
        SEND MESSAGE
      </button>
    </form>
  );
}
