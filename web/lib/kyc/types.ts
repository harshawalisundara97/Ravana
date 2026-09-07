export type KycResultStatus = "in_progress" | "cleared" | "rejected";

export interface KycSession {
  applicantId: string;
  // For a real vendor this is a short-lived WebSDK access token the client
  // uses to open the vendor's hosted verification widget. The mock provider
  // returns a placeholder so the UI can render its own dev-only flow.
  token: string;
  mock: boolean;
}

export interface KycWebhookEvent {
  applicantId: string;
  eventType: string;
  status: KycResultStatus;
  reason?: string;
}

export interface KycProvider {
  readonly name: string;
  createSession(input: { userId: string; email: string; fullName: string }): Promise<KycSession>;
  verifyWebhookSignature(rawBody: string, headers: Headers): boolean;
  parseWebhookEvent(rawBody: string): KycWebhookEvent;
}
