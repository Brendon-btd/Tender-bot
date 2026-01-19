"use client";

import { useEffect, useMemo, useState } from "react";

type DetectedField = {
  id: string;
  label: string;
  mappedKey: string;
  suggestedValue: string;
  confidence: "high" | "medium" | "low";
  reason: string;
};

type GroupedFields = {
  high: DetectedField[];
  medium: DetectedField[];
  low: DetectedField[];
};

const groupFields = (fields: DetectedField[]): GroupedFields =>
  fields.reduce(
    (acc, field) => {
      acc[field.confidence].push(field);
      return acc;
    },
    { high: [], medium: [], low: [] } as GroupedFields
  );

export default function ReviewPage({ params }: { params: { docId: string } }) {
  const [fields, setFields] = useState<DetectedField[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [saveToProfile, setSaveToProfile] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadFields = async () => {
      setStatus("Detecting fields...");
      const res = await fetch(`/api/doc/${params.docId}/fields`);
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Unable to detect fields.");
        return;
      }
      setFields(data.fields || []);
      setStatus(null);
    };
    loadFields();
  }, [params.docId]);

  const grouped = useMemo(() => groupFields(fields), [fields]);

  const handleChange = (id: string, value: string) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, suggestedValue: value } : field))
    );
  };

  const handleGenerate = async () => {
    setStatus("Generating document...");
    const res = await fetch(`/api/doc/${params.docId}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields, saveToProfile })
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Unable to generate document.");
      return;
    }
    setDownloadUrl(data.downloadUrl);
    setStatus("Document generated.");
  };

  const renderGroup = (title: string, color: string, items: DetectedField[]) => (
    <div className="space-y-3">
      <h3 className={`text-sm font-semibold uppercase ${color}`}>{title}</h3>
      <div className="space-y-4">
        {items.map((field) => (
          <div key={field.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-slate-800">{field.label}</p>
                <p className="text-xs text-slate-500">{field.reason}</p>
              </div>
              <span className={`text-xs font-semibold ${color}`}>{field.confidence}</span>
            </div>
            <input
              className="mt-3 w-full"
              value={field.suggestedValue}
              onChange={(event) => handleChange(field.id, event.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="p-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review & Edit</h2>
        <p className="text-slate-600">
          Confirm detected fields before generating the final DOCX. Low confidence fields are
          marked for review.
        </p>
      </div>

      {status && <p className="text-sm text-slate-600">{status}</p>}

      <div className="space-y-8">
        {renderGroup("High confidence", "text-emerald-600", grouped.high)}
        {renderGroup("Medium confidence", "text-amber-600", grouped.medium)}
        {renderGroup("Low or missing", "text-rose-600", grouped.low)}
      </div>

      <div className="flex items-center gap-3">
        <input
          id="save-profile"
          type="checkbox"
          checked={saveToProfile}
          onChange={(event) => setSaveToProfile(event.target.checked)}
        />
        <label htmlFor="save-profile">Save my edits back to company profile</label>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleGenerate}
          className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
        >
          Generate DOCX
        </button>
        {downloadUrl && (
          <a
            className="text-sm font-medium text-slate-700 underline"
            href={downloadUrl}
          >
            Download generated DOCX
          </a>
        )}
      </div>
    </section>
  );
}
