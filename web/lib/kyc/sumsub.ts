import { createHmac } from "crypto";
import type { KycProvider, KycSession, KycWebhookEvent } from "./types";

const BASE_URL = "https://api.sumsub.com";

// Sumsub signs every request with HMAC-SHA256 over
// timestamp + method + path(+query) + body, using the secret key, sent as
// X-App-Access-Sig alongside X-App-Token and X-App-Access-Ts.
// https://docs.sumsub.com/reference/authentication
function signRequest(method: string, pathWithQuery: string, body: string, secretKey: string) {
  const ts = Math.floor(Date.now() / 1000);
  const sig = createHmac("sha256", secretKey).update(`${ts}${method}${pathWithQuery}${body}`).digest("hex");
  return { ts, sig };
}

export class SumsubKycProvider implements KycProvider {
  readonly name = "sumsub";
  private appToken: string;
  private secretKey: string;
  private webhookSecret: string;
  private levelName: string;

  constructor() {
    const appToken = process.env.SUMSUB_APP_TOKEN;
    const secretKey = process.env.SUMSUB_SECRET_KEY;
    const webhookSecret = process.env.SUMSUB_WEBHOOK_SECRET;
    const levelName = process.env.SUMSUB_LEVEL_NAME;

    if (!appToken || !secretKey || !webhookSecret || !levelName) {
      throw new Error(
        "KYC_PROVIDER=sumsub requires SUMSUB_APP_TOKEN, SUMSUB_SECRET_KEY, SUMSUB_WEBHOOK_SECRET and SUMSUB_LEVEL_NAME to be set."
      );
    }
    this.appToken = appToken;
    this.secretKey = secretKey;
    this.webhookSecret = webhookSecret;
    this.levelName = levelName;
  }

  private async signedRequest(method: string, pathWithQuery: string, body = "") {
    const { ts, sig } = signRequest(method, pathWithQuery, body, this.secretKey);
    const res = await fetch(`${BASE_URL}${pathWithQuery}`, {
      method,
      headers: {
        "X-App-Token": this.appToken,
        "X-App-Access-Sig": sig,
        "X-App-Access-Ts": String(ts),
        "Content-Type": "application/json",
      },
      body: body || undefined,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Sumsub API error ${res.status}: ${text}`);
    }
    return res.json();
  }

  async createSession(input: { userId: string; email: string; fullName: string }): Promise<KycSession> {
    // 1. Create (or reuse) the applicant, keyed by our own user id.
    const applicantBody = JSON.stringify({
      externalUserId: input.userId,
      email: input.email,
      fixedInfo: { firstName: input.fullName.split(" ")[0], lastName: input.fullName.split(" ").slice(1).join(" ") },
    });
    const applicant = await this.signedRequest("POST", `/resources/applicants?levelName=${encodeURIComponent(this.levelName)}`, applicantBody);

    // 2. Mint a short-lived WebSDK access token for the client to open the
    // hosted verification widget against this applicant.
    const tokenPath = `/resources/accessTokens?userId=${encodeURIComponent(input.userId)}&levelName=${encodeURIComponent(this.levelName)}`;
    const tokenRes = (await this.signedRequest("POST", tokenPath)) as { token: string };

    return { applicantId: applicant.id, token: tokenRes.token, mock: false };
  }

  verifyWebhookSignature(rawBody: string, headers: Headers): boolean {
    // Sumsub sends the HMAC of the raw body as X-Payload-Digest, algorithm
    // named in X-Payload-Digest-Alg (typically HMAC_SHA1_HEX or SHA256).
    const digest = headers.get("x-payload-digest");
    const alg = (headers.get("x-payload-digest-alg") || "HMAC_SHA1_HEX").toLowerCase();
    if (!digest) return false;
    const hashAlg = alg.includes("sha256") ? "sha256" : "sha1";
    const expected = createHmac(hashAlg, this.webhookSecret).update(rawBody).digest("hex");
    return expected === digest;
  }

  parseWebhookEvent(rawBody: string): KycWebhookEvent {
    const payload = JSON.parse(rawBody) as {
      applicantId: string;
      externalUserId?: string;
      type: string;
      reviewResult?: { reviewAnswer?: "GREEN" | "RED"; rejectLabels?: string[] };
      reviewStatus?: string;
    };

    let status: KycWebhookEvent["status"] = "in_progress";
    if (payload.type === "applicantReviewed") {
      status = payload.reviewResult?.reviewAnswer === "GREEN" ? "cleared" : "rejected";
    }

    return {
      applicantId: payload.applicantId,
      eventType: payload.type,
      status,
      reason: payload.reviewResult?.rejectLabels?.join(", "),
    };
  }
}
