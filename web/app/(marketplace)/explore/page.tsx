import { gems } from "@/lib/data";
import { ExploreClient } from "./ExploreClient";

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  return <ExploreClient gems={gems} initialType={type} />;
}
