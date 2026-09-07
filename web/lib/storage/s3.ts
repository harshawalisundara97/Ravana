import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { StorageDriver, StoredFile } from "./types";

// Production driver: any S3-compatible target (AWS S3, Cloudflare R2,
// Backblaze B2). Configure via env — see .env.example. Selected automatically
// when STORAGE_DRIVER=s3.
export class S3StorageDriver implements StorageDriver {
  private client: S3Client;
  private bucket: string;
  private publicUrlBase: string;

  constructor() {
    const bucket = process.env.S3_BUCKET;
    const region = process.env.S3_REGION;
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    const endpoint = process.env.S3_ENDPOINT; // set for R2 / B2, omit for AWS
    const publicUrlBase = process.env.S3_PUBLIC_URL_BASE;

    if (!bucket || !region || !accessKeyId || !secretAccessKey || !publicUrlBase) {
      throw new Error(
        "STORAGE_DRIVER=s3 requires S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY and S3_PUBLIC_URL_BASE to be set."
      );
    }

    this.bucket = bucket;
    this.publicUrlBase = publicUrlBase.replace(/\/$/, "");
    this.client = new S3Client({
      region,
      endpoint,
      forcePathStyle: !!endpoint, // required for R2 / most non-AWS endpoints
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async put(key: string, data: Buffer, contentType: string): Promise<StoredFile> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: data,
        ContentType: contentType,
      })
    );
    return { key, url: `${this.publicUrlBase}/${key}` };
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}
