import { auth } from "@/auth";
import { getGemsBySeller } from "@/lib/queries";
import { MyGemsClient } from "./MyGemsClient";

export default async function MyGemsPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const gems = userId ? await getGemsBySeller(userId) : [];
  return <MyGemsClient gems={gems} />;
}
