import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Melsoft TenderPilot",
  description: "Auto-fill South African tender documents with a saved company profile."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="bg-white border-b border-slate-200">
            <div className="mx-auto max-w-5xl px-6 py-6">
              <h1 className="text-2xl font-semibold">Melsoft TenderPilot</h1>
              <p className="text-sm text-slate-600">
                Auto-fill SBD tender documents and generate a review-ready DOCX.
              </p>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-6 py-8 space-y-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
