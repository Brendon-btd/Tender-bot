import Link from "next/link";

export default function HomePage() {
  return (
    <section className="p-8 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Tender workflow</h2>
        <p className="text-slate-600">
          Set up your company profile, upload a tender document, review detected fields, and
          export a completed DOCX.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/company"
          className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 hover:bg-white"
        >
          <h3 className="font-semibold">1. Company Profile</h3>
          <p className="text-sm text-slate-600">Save reusable profile details.</p>
        </Link>
        <Link
          href="/upload"
          className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 hover:bg-white"
        >
          <h3 className="font-semibold">2. Upload Document</h3>
          <p className="text-sm text-slate-600">DOCX/PDF tender files.</p>
        </Link>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
          <h3 className="font-semibold">3. Review & Export</h3>
          <p className="text-sm text-slate-600">Confirm fields and generate DOCX.</p>
        </div>
      </div>
    </section>
  );
}
