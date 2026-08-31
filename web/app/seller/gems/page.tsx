import { sellerGems } from "@/lib/data";
import { MyGemsClient } from "./MyGemsClient";

export default function MyGemsPage() {
  return <MyGemsClient gems={sellerGems("s1")} />;
}
