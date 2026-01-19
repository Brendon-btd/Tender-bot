import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractDocxText } from "@/lib/parse/docx";
import { extractPdfText } from "@/lib/parse/pdf";
import { detectFields } from "@/lib/detectFields";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const doc = await prisma.uploadedDocument.findUnique({
    where: { id: params.id }
  });

  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  if (doc.detectedFields) {
    return NextResponse.json({ fields: doc.detectedFields, document: doc });
  }

  const profile = await prisma.companyProfile.findFirst({
    orderBy: { updatedAt: "desc" }
  });

  if (!profile) {
    return NextResponse.json(
      { error: "Company profile required before detecting fields." },
      { status: 400 }
    );
  }

  const extractedText = doc.mimetype.includes("pdf")
    ? await extractPdfText(doc.path)
    : await extractDocxText(doc.path);

  const fields = detectFields(extractedText, profile);

  const updated = await prisma.uploadedDocument.update({
    where: { id: params.id },
    data: {
      extractedText,
      detectedFields: fields
    }
  });

  return NextResponse.json({ fields, document: updated });
}
