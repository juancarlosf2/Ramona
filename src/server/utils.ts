// src/server/modules/utils.ts

// Helper to parse currency strings into numbers on the server
export const parseCurrencyServer = (
  value: string | number | null | undefined
): number | null => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return value;
  // Remove non-digit/non-dot characters, handle potential commas as thousands separators
  const cleanedValue = String(value)
    .replace(/[^\d.,]/g, "")
    .replace(",", "."); // Clean and replace comma with dot for float parsing
  const numericValue = parseFloat(cleanedValue);
  return isNaN(numericValue) ? null : numericValue;
};
