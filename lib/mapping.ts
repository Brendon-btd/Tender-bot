export type Confidence = "high" | "medium" | "low";

export type FieldMapping = {
  id: string;
  label: string;
  mappedKey: keyof CompanyProfileInput;
  suggestedValue: string;
  confidence: Confidence;
  reason: string;
};

export type CompanyProfileInput = {
  company_name: string;
  registration_number?: string | null;
  vat_number?: string | null;
  tax_pin?: string | null;
  csd_number?: string | null;
  physical_address?: string | null;
  postal_address?: string | null;
  email?: string | null;
  phone?: string | null;
  cellphone?: string | null;
  signatory_name?: string | null;
  signatory_id_number?: string | null;
  signatory_title?: string | null;
  is_foreign_supplier?: boolean | null;
  is_accredited_rep?: boolean | null;
};

export const mappingDictionary: Record<keyof CompanyProfileInput, string[]> = {
  company_name: ["name of bidder", "company name", "supplier name", "bidder name"],
  registration_number: [
    "company registration number",
    "registration number",
    "reg no",
    "registration no"
  ],
  vat_number: ["vat registration number", "vat number", "vat no"],
  tax_pin: ["tax compliance pin", "tcs pin", "tax pin"],
  csd_number: ["csd number"],
  physical_address: ["street address", "physical address", "business address"],
  postal_address: ["postal address", "postal box"],
  email: ["email", "email address"],
  phone: ["phone", "telephone", "tel"],
  cellphone: ["cell", "cellphone", "mobile"],
  signatory_name: ["signature", "authorised representative", "director", "signatory"],
  signatory_id_number: ["id number", "identity number"],
  signatory_title: ["title", "designation", "position"],
  is_foreign_supplier: ["foreign supplier"],
  is_accredited_rep: ["accredited representative", "accredited rep"]
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const similarityScore = (needle: string, haystack: string) => {
  if (haystack.includes(needle)) return 1;
  const needleTokens = new Set(needle.split(" "));
  const haystackTokens = new Set(haystack.split(" "));
  const intersection = [...needleTokens].filter((token) => haystackTokens.has(token));
  return intersection.length / Math.max(needleTokens.size, 1);
};

export const detectMappingForLabel = (label: string) => {
  const normalizedLabel = normalize(label);
  let bestMatch: {
    key: keyof CompanyProfileInput;
    score: number;
    sample: string;
  } | null = null;

  (Object.keys(mappingDictionary) as Array<keyof CompanyProfileInput>).forEach((key) => {
    mappingDictionary[key].forEach((variant) => {
      const score = similarityScore(normalize(variant), normalizedLabel);
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { key, score, sample: variant };
      }
    });
  });

  return bestMatch;
};

export const scoreToConfidence = (score: number): Confidence => {
  if (score >= 0.75) return "high";
  if (score >= 0.45) return "medium";
  return "low";
};
