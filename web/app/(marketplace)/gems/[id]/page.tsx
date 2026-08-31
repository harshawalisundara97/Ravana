import { notFound } from "next/navigation";
import { getGem, getSeller } from "@/lib/data";
import { GemDetailClient } from "@/components/marketplace/GemDetailClient";

export default async function GemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gem = getGem(id);
  if (!gem) notFound();
  const seller = getSeller(gem.sellerId);
  if (!seller) notFound();
  return (
    <main>
      <GemDetailClient gem={gem} seller={seller} />
    </main>
  );
}
