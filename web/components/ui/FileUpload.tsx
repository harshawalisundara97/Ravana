"use client";
import { useRef, useState } from "react";
import { Check } from "lucide-react";

type Kind = "photo" | "video" | "document";

interface Props {
  kind: Kind;
  label: string;
  hint: string;
  accept: string;
  onUploaded: (url: string) => void;
  preview?: string;
}

export function FileUpload({ kind, label, hint, accept, onUploaded, preview }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">(preview ? "done" : "idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFile(file: File) {
    setState("uploading");
    setError(null);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", kind);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Upload failed.");
      setState("error");
      return;
    }
    const body = await res.json();
    setState("done");
    onUploaded(body.url);
  }

  return (
    <div
      className="aspect-square flex flex-col items-start justify-end p-2.5 gap-1 cursor-pointer overflow-hidden relative"
      style={{ border: "2px dashed var(--color-divider)", backgroundImage: preview ? `url(${preview})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <div className="relative z-10 flex flex-col gap-0.5" style={preview ? { background: "var(--color-bg)", padding: "3px 6px" } : undefined}>
        <span className="font-heading font-extrabold text-[13px] flex items-center gap-1.5">
          {label}
          {state === "done" && <Check size={12} strokeWidth={3} color="var(--color-accent)" />}
        </span>
        <span className="text-[10.5px] opacity-55">
          {state === "uploading" ? "Uploading..." : state === "error" ? error : state === "done" ? fileName ?? "Uploaded" : hint}
        </span>
      </div>
    </div>
  );
}
