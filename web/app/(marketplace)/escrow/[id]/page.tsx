import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getOrderById, getGemById, getSellerById } from "@/lib/queries";
import { EscrowClient } from "./EscrowClient";

export default async function EscrowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!userId) redirect(`/login?callbackUrl=/escrow/${id}`);

  const order = await getOrderById(id);
  if (!order) notFound();

  // An order is visible to its two parties and to admins, nobody else.
  const isParty = order.buyerId === userId || order.sellerId === userId || role === "admin";
  if (!isParty) notFound();

  const [gem, seller] = await Promise.all([getGemById(order.gemId), getSellerById(order.sellerId)]);
  if (!gem || !seller) notFound();

  const viewerRole = order.buyerId === userId ? "buyer" : order.sellerId === userId ? "seller" : "admin";

  return <EscrowClient order={order} gem={gem} seller={seller} viewerRole={viewerRole} />;
}
