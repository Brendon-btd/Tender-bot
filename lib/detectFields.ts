import { v4 as uuidv4 } from "uuid";
import {
  CompanyProfileInput,
  FieldMapping,
  detectMappingForLabel,
  mappingDictionary,
  scoreToConfidence
} from "@/lib/mapping";

export type DetectedField = FieldMapping;

const extractCandidateLabels = (text: string): string[] => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const candidates = new Set<string>();
  for (const line of lines) {
    if (line.length > 3 && line.length < 80) {
      candidates.add(line);
    }
  }

  return Array.from(candidates);
};

export const detectFields = (
  extractedText: string,
  profile: CompanyProfileInput
): DetectedField[] => {
  const detected: DetectedField[] = [];
  const labelCandidates = extractCandidateLabels(extractedText);
  const mappedKeys = new Set<keyof CompanyProfileInput>();

  labelCandidates.forEach((label) => {
    const match = detectMappingForLabel(label);
    if (!match) return;

    const confidence = scoreToConfidence(match.score);
    if (confidence === "low") return;

    const suggestedValue = profile[match.key];
    detected.push({
      id: uuidv4(),
      label,
      mappedKey: match.key,
      suggestedValue: suggestedValue ? String(suggestedValue) : "Needs review",
      confidence,
      reason:
        suggestedValue && suggestedValue !== ""
          ? `Matched '${match.sample}' in document text.`
          : `Matched '${match.sample}' but profile has no value.`
    });
    mappedKeys.add(match.key);
  });

  (Object.keys(mappingDictionary) as Array<keyof CompanyProfileInput>).forEach((key) => {
    if (mappedKeys.has(key)) return;
    const suggestedValue = profile[key];
    detected.push({
      id: uuidv4(),
      label: mappingDictionary[key][0] ?? key,
      mappedKey: key,
      suggestedValue: suggestedValue ? String(suggestedValue) : "Needs review",
      confidence: suggestedValue ? "medium" : "low",
      reason: suggestedValue
        ? "Profile value available but no direct match in document text."
        : "Field not detected in document text."
    });
  });

  return detected;
};
