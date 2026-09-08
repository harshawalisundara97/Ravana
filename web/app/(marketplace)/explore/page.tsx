import { getPublicGems } from "@/lib/queries";
import { ExploreClient } from "./ExploreClient";

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const gems = await getPublicGems();
  return <ExploreClient gems={gems} initialType={type} />;
}
