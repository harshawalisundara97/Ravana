import { ContactForm } from "./ContactForm";

export default function ContactPage() {
  return (
    <main className="px-8" style={{ padding: "44px 32px 60px" }}>
      <div className="text-[11px] tracking-[.16em] uppercase font-semibold mb-3.5" style={{ color: "var(--color-accent)" }}>
        Get in touch
      </div>
      <h1 className="mb-2.5">Contact RavanaGems</h1>
      <p className="text-[13.5px] opacity-65 max-w-[62ch] mb-8">For an active order, open a dispute or message the seller directly from the order page — it routes faster than email. For everything else, reach us below.</p>

      <div className="grid gap-12" style={{ gridTemplateColumns: "1fr 320px" }}>
        <ContactForm />
        <div>
          <h3 className="label-section !text-xs mb-3">Other ways to reach us</h3>
          <div className="text-[13px] flex flex-col gap-3.5">
            <div>
              <div className="font-heading font-extrabold text-sm mb-1">Support</div>
              <div className="opacity-70">support@ravanagems.com · replies within 1 business day</div>
            </div>
            <div>
              <div className="font-heading font-extrabold text-sm mb-1">Compliance & disputes</div>
              <div className="opacity-70">compliance@ravanagems.com</div>
            </div>
            <div>
              <div className="font-heading font-extrabold text-sm mb-1">Registered office</div>
              <div className="opacity-70">Colombo 03, Sri Lanka</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
