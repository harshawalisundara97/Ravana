import { notFound } from "next/navigation";
import { gems, bids } from "@/lib/data";
import { AuctionClient } from "./AuctionClient";

export default async function AuctionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gem = gems.find((g) => g.id === id && g.auction) ?? gems.find((g) => g.auction);
  if (!gem) notFound();
  const catalogue = gems.filter((g) => g.auction && g.id !== gem.id).slice(0, 6);
  return <AuctionClient gem={gem} bids={bids} catalogue={catalogue} />;
}
