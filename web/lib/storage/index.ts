import type { StorageDriver } from "./types";
import { LocalStorageDriver } from "./local";
import { S3StorageDriver } from "./s3";

let cached: StorageDriver | null = null;

// Single switch for the whole app: STORAGE_DRIVER=local (default, dev) or
// STORAGE_DRIVER=s3 (production — AWS S3, Cloudflare R2, or any S3-compatible
// target). Nothing else in the codebase needs to change when you flip this.
export function getStorageDriver(): StorageDriver {
  if (cached) return cached;
  cached = process.env.STORAGE_DRIVER === "s3" ? new S3StorageDriver() : new LocalStorageDriver();
  return cached;
}

export type { StorageDriver, StoredFile } from "./types";
