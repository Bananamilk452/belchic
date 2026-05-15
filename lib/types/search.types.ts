export const SORT_OPTIONS = [
  { value: "date_desc", label: "최신순" },
  { value: "date_asc", label: "오래된순" },
  { value: "price_asc", label: "가격 낮은 순" },
  { value: "price_desc", label: "가격 높은 순" },
  { value: "name_asc", label: "알파벳 순, A-Z" },
  { value: "name_desc", label: "알파벳 순, Z-A" },
] as const;

export const SORT_VALUES = SORT_OPTIONS.map((o) => o.value);
