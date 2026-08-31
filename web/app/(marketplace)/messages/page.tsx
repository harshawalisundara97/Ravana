import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const CONVERSATIONS = [
  { name: "Ceylon Rare Stones", time: "11:12", preview: "Yes — the report confirms heat only, no diffusion…", active: true },
  { name: "Mogok House", time: "09:40", preview: "Countered your offer at 9,000 USDT" },
  { name: "Nampula Rare", time: "Yesterday", preview: "Video of the Paraíba under daylight attached" },
  { name: "Tsavo Trading", time: "27 Aug", preview: "Dispute D-2026-0117 — moderated thread" },
  { name: "RavanaGems support", time: "24 Aug", preview: "Your withdrawal has been approved" },
];

export default function MessagesPage() {
  return (
    <main className="grid" style={{ gridTemplateColumns: "300px 1fr 320px", height: 760, borderBottom: "2px solid var(--color-divider)" }}>
      <aside className="border-r-2 overflow-hidden" style={{ borderColor: "var(--color-divider)" }}>
        <div className="px-4.5 py-4 border-b-2 flex justify-between items-center" style={{ borderColor: "var(--color-divider)" }}>
          <h1 className="text-[19px] m-0">Messages</h1>
          <span className="tag tag-accent" style={{ fontWeight: 600 }}>
            5 UNREAD
          </span>
        </div>
        <div className="px-4.5 pt-3.5 pb-3 border-b" style={{ borderColor: "var(--color-divider)" }}>
          <div className="flex items-center gap-2 px-2.5 py-1.5" style={{ border: "1px solid var(--color-divider)", background: "var(--color-surface)" }}>
            <span className="text-[12.5px] opacity-55">Search conversations</span>
          </div>
        </div>
        {CONVERSATIONS.map((c) => (
          <div
            key={c.name}
            className="px-4.5 py-3.5"
            style={{
              borderBottom: c.active ? "2px solid var(--color-accent)" : "1px solid var(--color-divider)",
              background: c.active ? "color-mix(in srgb, var(--color-accent) 8%, transparent)" : undefined,
            }}
          >
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-heading font-extrabold text-sm">{c.name}</span>
              <span className="text-[10.5px] opacity-55">{c.time}</span>
            </div>
            <div className="text-xs opacity-70 leading-snug">{c.preview}</div>
          </div>
        ))}
      </aside>

      <section className="flex flex-col overflow-hidden">
        <div className="px-6 py-3.5 border-b-2 flex items-center gap-3" style={{ borderColor: "var(--color-divider)" }}>
          <span className="w-9 h-9 bg-cover bg-center grayscale-photo" style={{ backgroundImage: "url(/gems/gem-01.jpg)" }} />
          <span className="flex-1">
            <span className="font-heading font-extrabold text-[15px] block">Ceylon Rare Stones</span>
            <span className="text-[11.5px] opacity-60">Typically replies in 2h · Sri Lanka, UTC+5:30</span>
          </span>
          <span className="tag tag-accent" style={{ fontWeight: 600 }}>
            VERIFIED
          </span>
        </div>
        <div className="flex-1 px-6 py-5.5 flex flex-col gap-4 overflow-hidden">
          <div className="text-center text-[10.5px] tracking-[.12em] uppercase opacity-45">Today</div>
          <div className="max-w-[66%] p-3.5 text-[13.5px] leading-relaxed" style={{ background: "var(--color-surface)" }}>
            Is this stone heated? The listing says heat only but I want to be sure before I make an offer.
          </div>
          <div className="max-w-[66%] self-end p-3.5 text-[13.5px] leading-relaxed" style={{ background: "var(--color-text)", color: "var(--color-bg)" }}>
            Yes — the GRS report confirms heat only, with no diffusion and no clarity filling. I&apos;ve attached the report and a daylight video.
          </div>
          <div className="max-w-[66%] self-end flex gap-2">
            <span className="w-24 h-24 bg-cover bg-center grayscale-photo" style={{ backgroundImage: "url(/gems/gem-02.jpg)" }} />
            <span className="w-24 h-24 flex items-end p-2.5 text-[10.5px] tracking-wider uppercase" style={{ background: "var(--color-surface)", border: "1px solid var(--color-divider)" }}>
              GRS report.pdf
            </span>
          </div>
          <div className="max-w-[66%] p-3.5 text-[13.5px] leading-relaxed" style={{ background: "var(--color-surface)" }}>
            Perfect. Would you take 2,650?
          </div>
          <div className="self-end p-3.5" style={{ border: "2px solid var(--color-accent)", maxWidth: "66%", width: 340 }}>
            <div className="text-[10.5px] tracking-[.12em] uppercase font-semibold mb-2" style={{ color: "var(--color-accent)" }}>
              Offer sent through the thread
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-heading font-extrabold text-[22px]">2,650 USDT</span>
              <span className="text-[11.5px] opacity-60">Expires in 47h</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-primary flex-1" style={{ padding: "9px 12px", fontSize: 12.5 }}>
                ACCEPT
              </button>
              <button className="btn btn-secondary flex-1" style={{ padding: "9px 12px", fontSize: 12.5 }}>
                COUNTER
              </button>
            </div>
          </div>
          <div className="flex gap-2.5 p-3 text-xs leading-relaxed" style={{ background: "color-mix(in srgb, var(--color-accent) 8%, transparent)" }}>
            <ShieldCheck size={15} strokeWidth={2.4} color="var(--color-accent)" style={{ flex: "none", marginTop: 1 }} />
            <span>Keep payment on RavanaGems. Anyone asking you to pay to a personal wallet is removed from the marketplace.</span>
          </div>
        </div>
        <div className="border-t-2 px-6 py-3.5 flex gap-2.5 items-center" style={{ borderColor: "var(--color-divider)" }}>
          <input className="input flex-1" placeholder="Write a message" />
          <button className="btn btn-secondary" style={{ padding: "9px 13px" }}>
            ATTACH
          </button>
          <button className="btn btn-primary" style={{ padding: "10px 18px" }}>
            SEND
          </button>
        </div>
      </section>

      <aside className="border-l-2 px-5 py-4.5" style={{ borderColor: "var(--color-divider)" }}>
        <div className="label-micro mb-3">About this stone</div>
        <div className="aspect-square bg-cover bg-center grayscale-photo mb-3" style={{ backgroundImage: "url(/gems/gem-03.jpg)" }} />
        <div className="font-heading font-extrabold text-base leading-tight mb-1">Natural Ceylon Blue Sapphire</div>
        <div className="text-xs opacity-60 mb-2">2.15 ct · Sri Lanka · Oval · Heated</div>
        <div className="font-heading font-extrabold text-xl mb-3.5">
          2,850 <span className="text-[11px] opacity-55 tracking-wider">USDT</span>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/gems/g3" className="btn btn-secondary text-left">
            OPEN THE LISTING
          </Link>
          <Link href="/verify" className="btn btn-secondary text-left">
            SHARE CERTIFICATE
          </Link>
          <Link href="/cart" className="btn btn-primary text-left">
            BUY AT 2,850 USDT
          </Link>
        </div>
        <div className="label-micro mt-6 mb-2.5">Thread</div>
        <div className="text-[12.5px] flex flex-col gap-2 opacity-80">
          <span>Started 28 Aug</span>
          <span>2 attachments</span>
          <span>1 live offer</span>
          <span>Moderated for off-platform payment</span>
        </div>
      </aside>
    </main>
  );
}
