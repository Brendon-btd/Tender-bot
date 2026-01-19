import { NextResponse } from "next/server";
import fs from "fs/promises";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("file");

  const generated = await prisma.generatedDocument.findFirst({
    where: fileId ? { id: fileId, documentId: params.id } : { documentId: params.id },
    orderBy: { createdAt: "desc" }
  });

  if (!generated) {
    return NextResponse.json({ error: "Generated file not found" }, { status: 404 });
  }

  const fileBuffer = await fs.readFile(generated.path);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${generated.filename}"`
    }
  });
}
