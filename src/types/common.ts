// src/types/common.ts

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  timestamp?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp?: string;
  statusCode?: number;
}

export type AnyApiResponse<T> = ApiResponse<T> | ApiErrorResponse;

export interface ApiPaginationParams {
  limit?: number;
  cursor?: string;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    next_cursor: string | null;
    has_more: boolean;
  };
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;
