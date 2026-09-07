import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { auth } from "@/auth";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { getStorageDriver } from "@/lib/storage";

const LIMITS: Record<string, { types: string[]; maxBytes: number }> = {
  photo: { types: ["image/jpeg", "image/png", "image/webp"], maxBytes: 8 * 1024 * 1024 },
  video: { types: ["video/mp4", "video/quicktime", "video/webm"], maxBytes: 60 * 1024 * 1024 },
  document: { types: ["application/pdf"], maxBytes: 15 * 1024 * 1024 },
};

function extensionFor(mimeType: string) {
  return (
    {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "video/mp4": "mp4",
      "video/quicktime": "mov",
      "video/webm": "webm",
      "application/pdf": "pdf",
    }[mimeType] ?? "bin"
  );
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Sign in to upload files." }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const kind = formData.get("kind");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (typeof kind !== "string" || !LIMITS[kind]) {
    return NextResponse.json({ error: "Invalid upload kind." }, { status: 400 });
  }

  const limit = LIMITS[kind];
  if (!limit.types.includes(file.type)) {
    return NextResponse.json({ error: `Unsupported file type for ${kind}: ${file.type || "unknown"}.` }, { status: 415 });
  }
  if (file.size > limit.maxBytes) {
    return NextResponse.json({ error: `File exceeds the ${Math.round(limit.maxBytes / (1024 * 1024))} MB limit for ${kind} uploads.` }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `${kind}/${userId}/${randomUUID()}.${extensionFor(file.type)}`;

  const storage = getStorageDriver();
  const stored = await storage.put(key, buffer, file.type);

  const [row] = await db
    .insert(mediaAssets)
    .values({
      ownerId: userId,
      kind: kind as "photo" | "video" | "document",
      storageKey: stored.key,
      url: stored.url,
      mimeType: file.type,
      sizeBytes: file.size,
      originalName: file.name,
    })
    .returning();

  return NextResponse.json({ id: row.id, url: row.url }, { status: 201 });
}
