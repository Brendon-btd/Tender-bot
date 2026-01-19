"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setStatus("Please select a DOCX or PDF file.");
      return;
    }
    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      setStatus("Upload failed.");
      return;
    }

    const data = await res.json();
    setStatus("Upload complete.");
    router.push(`/review/${data.id}`);
  };

  return (
    <section className="p-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Upload tender document</h2>
        <p className="text-slate-600">Upload SBD1, SBD4, SBD 6.1, or POPIA forms.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".docx,.pdf"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        <div>
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
          >
            Upload document
          </button>
        </div>
        {status && <p className="text-sm text-slate-600">{status}</p>}
      </form>
    </section>
  );
}
