import { Header } from "@/components/marketplace/Header";
import { Footer } from "@/components/marketplace/Footer";

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
