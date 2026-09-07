import { randomUUID } from "crypto";
import type { KycProvider, KycSession, KycWebhookEvent } from "./types";

// Dev-only stand-in for a real vendor. createSession fabricates an applicant
// id instead of calling out to anyone; there is no real webhook traffic, so
// the /api/kyc/dev-simulate route drives status changes directly during
// local development and testing.
export class MockKycProvider implements KycProvider {
  readonly name = "mock";

  async createSession(input: { userId: string; email: string; fullName: string }): Promise<KycSession> {
    return {
      applicantId: `mock_${randomUUID()}`,
      token: `mock-token-${randomUUID()}`,
      mock: true,
    };
  }

  verifyWebhookSignature(_rawBody: string, _headers: Headers): boolean {
    // The mock provider never receives real webhooks; dev-simulate bypasses
    // this entirely. Always false here so a stray external POST is rejected.
    return false;
  }

  parseWebhookEvent(_rawBody: string): KycWebhookEvent {
    throw new Error("MockKycProvider does not receive webhooks — use /api/kyc/dev-simulate.");
  }
}
