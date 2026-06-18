import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatMetricValue(value, unit) {
  if (unit === '%') return `${value}%`;
  return `${value} ${unit || ''}`.trim();
}

export function isValidUuid(value) {
  const EMPTY_UUID = "00000000-0000-0000-0000-000000000000";

  if (!value) return false;
  if (value === EMPTY_UUID) return false;
  if (value === "undefined") return false;
  if (value === "null") return false;

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
