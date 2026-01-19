import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const profileSchema = z.object({
  company_name: z.string().min(1),
  registration_number: z.string().optional().nullable(),
  vat_number: z.string().optional().nullable(),
  tax_pin: z.string().optional().nullable(),
  csd_number: z.string().optional().nullable(),
  physical_address: z.string().optional().nullable(),
  postal_address: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  cellphone: z.string().optional().nullable(),
  signatory_name: z.string().optional().nullable(),
  signatory_id_number: z.string().optional().nullable(),
  signatory_title: z.string().optional().nullable(),
  is_foreign_supplier: z.boolean().optional().nullable(),
  is_accredited_rep: z.boolean().optional().nullable()
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = profileSchema.parse(await request.json());
  const existing = await prisma.companyProfile.findUnique({
    where: { id: params.id }
  });

  if (!existing) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const profile = await prisma.companyProfile.update({
    where: { id: params.id },
    data: body
  });

  await prisma.profileVersion.create({
    data: {
      profileId: profile.id,
      snapshot: profile
    }
  });

  return NextResponse.json(profile);
}
