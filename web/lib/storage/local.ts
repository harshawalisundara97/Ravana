import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import type { StorageDriver, StoredFile } from "./types";

// Dev-only driver: writes into public/uploads so Next.js serves the file
// directly at /uploads/<key>. Never used when STORAGE_DRIVER=s3.
const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export class LocalStorageDriver implements StorageDriver {
  async put(key: string, data: Buffer, _contentType: string): Promise<StoredFile> {
    const destPath = path.join(UPLOAD_ROOT, key);
    await mkdir(path.dirname(destPath), { recursive: true });
    await writeFile(destPath, data);
    return { key, url: `/uploads/${key}` };
  }

  async delete(key: string): Promise<void> {
    const destPath = path.join(UPLOAD_ROOT, key);
    await unlink(destPath).catch(() => {});
  }
}
