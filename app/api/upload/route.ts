import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { prisma } from "@/lib/db";

const uploadDir = path.join(process.cwd(), "uploads");

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);

  const doc = await prisma.uploadedDocument.create({
    data: {
      filename: file.name,
      mimetype: file.type,
      path: filePath
    }
  });

  return NextResponse.json(doc, { status: 201 });
}
