import { notFound } from "next/navigation";
import { getGemById, getSellerById } from "@/lib/queries";
import { GemDetailClient } from "@/components/marketplace/GemDetailClient";

export default async function GemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gem = await getGemById(id);
  if (!gem) notFound();
  const seller = await getSellerById(gem.sellerId);
  if (!seller) notFound();
  return (
    <main>
      <GemDetailClient gem={gem} seller={seller} />
    </main>
  );
}
