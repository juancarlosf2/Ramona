import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  if (!name) return "";

  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function generateAvatarColor(name: string): string {
  // Define a set of pleasant, accessible colors
  const colors = [
    "#4F46E5", // indigo
    "#0EA5E9", // sky
    "#10B981", // emerald
    "#F59E0B", // amber
    "#8B5CF6", // violet
    "#EC4899", // pink
    "#F43F5E", // rose
    "#06B6D4", // cyan
    "#14B8A6", // teal
    "#6366F1", // indigo
  ];

  // Generate a simple hash from the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use the hash to pick a color
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseCurrency(
  value: string | number | null | undefined
): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return value;
  // Remove non-digit characters and parse as number
  const cleanedValue = String(value)
    .replace(/[^\d.,]/g, "")
    .replace(",", ".");
  const numericValue = parseFloat(cleanedValue);
  return isNaN(numericValue) ? null : numericValue;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-DO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
