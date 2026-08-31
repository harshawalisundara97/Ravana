import { notFound } from "next/navigation";
import { orders, getGem, getSeller } from "@/lib/data";
import { EscrowClient } from "./EscrowClient";

export default async function EscrowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = orders.find((o) => o.id === id);
  if (!order) notFound();
  const gem = getGem(order.gemId);
  const seller = getSeller(order.sellerId);
  if (!gem || !seller) notFound();
  return <EscrowClient order={order} gem={gem} seller={seller} />;
}
