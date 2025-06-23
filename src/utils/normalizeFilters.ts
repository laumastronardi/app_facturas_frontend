// src/utils/normalizeFilters.ts

import type { FilterValues } from "../types/filter_values";

export function normalizeFilters(filters: FilterValues): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in filters) {
    const value = filters[key as keyof FilterValues];
    if (Array.isArray(value)) {
      if (value.length > 0) result[key] = value.join(',');
    } else if (value !== undefined && value !== null && value !== '') {
      result[key] = String(value);
    }
  }
  return result;
}
