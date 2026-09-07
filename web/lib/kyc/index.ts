import type { KycProvider } from "./types";
import { MockKycProvider } from "./mock";
import { SumsubKycProvider } from "./sumsub";

let cached: KycProvider | null = null;

// Single switch for the whole app: KYC_PROVIDER=mock (default, dev) or
// KYC_PROVIDER=sumsub (production, once you have a Sumsub business account
// and API keys — see .env.example). Nothing else needs to change.
export function getKycProvider(): KycProvider {
  if (cached) return cached;
  cached = process.env.KYC_PROVIDER === "sumsub" ? new SumsubKycProvider() : new MockKycProvider();
  return cached;
}

export type { KycProvider, KycSession, KycWebhookEvent, KycResultStatus } from "./types";
