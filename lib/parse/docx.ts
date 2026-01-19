import fs from "fs/promises";
import mammoth from "mammoth";

export const extractDocxText = async (filePath: string) => {
  const buffer = await fs.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value ?? "";
};
