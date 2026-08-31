import { gems } from "@/lib/data";
import { CartClient } from "./CartClient";

export default function CartPage() {
  return <CartClient initialGems={[gems[2], gems[5], gems[8]]} />;
}
