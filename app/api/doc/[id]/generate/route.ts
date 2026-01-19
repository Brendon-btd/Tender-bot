import { NextResponse } from "next/server";
import { z } from "zod";
import path from "path";
import { prisma } from "@/lib/db";
import { generateFilledDocx } from "@/lib/generateDocx";
import { CompanyProfileInput } from "@/lib/mapping";

const fieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  mappedKey: z.string(),
  suggestedValue: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
  reason: z.string()
});

const payloadSchema = z.object({
  fields: z.array(fieldSchema),
  saveToProfile: z.boolean().default(false)
});

const booleanKeys = new Set<keyof CompanyProfileInput>([
  "is_foreign_supplier",
  "is_accredited_rep"
]);

const sanitizeValue = (key: keyof CompanyProfileInput, value: string) => {
  if (!value || value.trim() === "" || value === "Needs review") {
    return null;
  }

  if (booleanKeys.has(key)) {
    const normalized = value.toLowerCase();
    if (["true", "yes", "1"].includes(normalized)) return true;
    if (["false", "no", "0"].includes(normalized)) return false;
    return null;
  }

  return value;
};

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const payload = payloadSchema.parse(await request.json());
  const doc = await prisma.uploadedDocument.findUnique({
    where: { id: params.id }
  });

  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const profile = await prisma.companyProfile.findFirst({
    orderBy: { updatedAt: "desc" }
  });

  if (!profile) {
    return NextResponse.json({ error: "Company profile not found" }, { status: 400 });
  }

  const data = payload.fields.reduce((acc, field) => {
    const key = field.mappedKey as keyof CompanyProfileInput;
    acc[key] = field.suggestedValue;
    return acc;
  }, {} as Record<keyof CompanyProfileInput, string>);

  if (payload.saveToProfile) {
    const updateData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        sanitizeValue(key as keyof CompanyProfileInput, value)
      ])
    ) as CompanyProfileInput;

    const updatedProfile = await prisma.companyProfile.update({
      where: { id: profile.id },
      data: updateData
    });
    await prisma.profileVersion.create({
      data: {
        profileId: updatedProfile.id,
        snapshot: updatedProfile
      }
    });
  }

  const outputDir = path.join(process.cwd(), "uploads", "generated");
  const { outputPath, filename } = await generateFilledDocx(doc.path, outputDir, {
    ...profile,
    ...data
  });

  const generated = await prisma.generatedDocument.create({
    data: {
      documentId: doc.id,
      filename,
      path: outputPath
    }
  });

  return NextResponse.json({
    generated,
    downloadUrl: `/api/doc/${doc.id}/download?file=${generated.id}`
  });
}
