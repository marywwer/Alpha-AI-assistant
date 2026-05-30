import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatMetricValue(value, unit) {
  if (unit === '%') return `${value}%`;
  return `${value} ${unit || ''}`.trim();
}
