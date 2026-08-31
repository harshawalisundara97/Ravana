import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex items-center gap-6.5 px-7 py-3.5" style={{ background: "var(--color-accent)", color: "var(--color-bg)" }}>
        <span className="font-heading font-extrabold text-[17px]">
          RAVANAGEMS <span className="font-normal text-[13px] tracking-[.14em] uppercase opacity-85">Admin console</span>
        </span>
        <span className="ml-auto flex items-center gap-4.5 text-[12.5px]">
          <span className="opacity-90">14 gems awaiting verification · 3 open disputes · 21 withdrawals queued</span>
          <span className="opacity-90">S. Perera · Compliance</span>
        </span>
      </div>
      <div className="grid flex-1" style={{ gridTemplateColumns: "220px 1fr" }}>
        <AdminNav />
        <section className="px-8 pt-6 pb-16">{children}</section>
      </div>
    </>
  );
}
