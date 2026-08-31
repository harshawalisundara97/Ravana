import { gems } from "@/lib/data";
import { VerificationClient } from "./VerificationClient";

export default function VerificationPage() {
  const queue = gems.filter((g) => g.status === "in_review").slice(0, 5);
  return <VerificationClient queue={queue.length ? queue : gems.slice(0, 5)} />;
}
