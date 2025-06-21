export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}