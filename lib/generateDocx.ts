import fs from "fs/promises";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { CompanyProfileInput } from "@/lib/mapping";

const hasTemplatePlaceholders = (content: string) => content.includes("{{") && content.includes("}}");

const replaceLinePlaceholders = (xml: string, data: Record<string, string>) => {
  let updated = xml;
  Object.entries(data).forEach(([key, value]) => {
    const label = key.replace(/_/g, " ");
    const pattern = new RegExp(`${label}[^\\n]{0,50}[_]+`, "gi");
    updated = updated.replace(pattern, (match) => match.replace(/_+/, value));
  });
  return updated;
};

export const generateFilledDocx = async (
  inputPath: string,
  outputDir: string,
  data: CompanyProfileInput
) => {
  const templateBuffer = await fs.readFile(inputPath);
  const zip = new PizZip(templateBuffer);
  const docXml = zip.file("word/document.xml")?.asText() ?? "";
  const sanitizedData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value ? String(value) : "Needs review"])
  );

  if (hasTemplatePlaceholders(docXml)) {
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true
    });
    doc.render(sanitizedData);
    const output = doc.getZip().generate({ type: "nodebuffer" });
    await fs.mkdir(outputDir, { recursive: true });
    const filename = `tender-filled-${Date.now()}.docx`;
    const outputPath = path.join(outputDir, filename);
    await fs.writeFile(outputPath, output);
    return { outputPath, filename };
  }

  const updatedXml = replaceLinePlaceholders(docXml, sanitizedData);
  zip.file("word/document.xml", updatedXml);
  const output = zip.generate({ type: "nodebuffer" });
  await fs.mkdir(outputDir, { recursive: true });
  const filename = `tender-filled-${Date.now()}.docx`;
  const outputPath = path.join(outputDir, filename);
  await fs.writeFile(outputPath, output);
  return { outputPath, filename };
};
