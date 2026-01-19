import fs from "fs/promises";
import pdfParse from "pdf-parse";

export const extractPdfText = async (filePath: string) => {
  const buffer = await fs.readFile(filePath);
  const result = await pdfParse(buffer);
  return result.text ?? "";
};
