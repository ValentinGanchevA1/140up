// src/types/api.ts
import type { User, AuthUser, Message, Product, Match } from './index';
import type {
  ApiResponse,
  PaginatedResponse,
  Coordinates,
  ApiPaginationParams,
} from './common';

interface WsTypingPayload {
  user_id: string;
  conversation_id: string;
  is_typing: boolean;
}

interface WsOnlineStatusPayload {
  user_id: string;
  is_online: boolean;
  last_seen: string;
}

export type IncomingWebSocketMessage =
    | { type: 'new_message'; data: Message }
    | { type: 'new_match'; data: Match }
    | { type: 'typing_status'; data: WsTypingPayload }
    | { type: 'online_status'; data: WsOnlineStatusPayload }
    | { type: 'error'; data: { code: string; message: string } };

export interface WsUpdateLocationPayload {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface WsSendTypingPayload {
  conversation_id: string;
  is_typing: boolean;
}

export type OutgoingWebSocketMessage =
    | { type: 'update_location'; data: WsUpdateLocationPayload }
    | { type: 'send_typing'; data: WsSendTypingPayload };

export interface ApiLocationSearchParams {
  latitude: number;
  longitude: number;
  radius?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  birth_date: string;
  location?: Coordinates;
}

export type RegisterResponse = ApiResponse<{ user: User; token: string }>;
export type LoginResponse = ApiResponse<{ user: AuthUser; token: string }>;

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  interests?: string[];
  profile_photos?: string[];
  location?: Coordinates;
}
export type UpdateProfileResponse = ApiResponse<{ user: User }>;

export interface SearchUsersRequest extends ApiPaginationParams, ApiLocationSearchParams {}
export type SearchUsersResponse = PaginatedResponse<User>;

export interface GetMessagesRequest extends ApiPaginationParams {
  conversation_id: string;
}
export type GetMessagesResponse = PaginatedResponse<Message>;

export interface GetPotentialMatchesRequest extends ApiPaginationParams, ApiLocationSearchParams {
  age_range?: [number, number];
}
export type GetPotentialMatchesResponse = PaginatedResponse<User>;

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  condition: 'new' | 'used' | 'refurbished';
  location: Coordinates;
}
export type CreateProductResponse = ApiResponse<{ product: Product }>;

export interface SearchProductsRequest extends ApiPaginationParams, ApiLocationSearchParams {
  query?: string;
  category?: string;
  price_range?: [number, number];
  condition?: 'new' | 'used' | 'refurbished';
}
export type SearchProductsResponse = PaginatedResponse<Product>;
