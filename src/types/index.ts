// src/types/index.ts
export * from './api';
// export * from './common'; // FIX: common.ts is now imported by api.ts and store.ts, preventing circular dependency
export * from './navigation';
export * from './store';

// =================================================================
// Core Entity Types
// =================================================================

export interface AuthUser extends User {
  token: string;
  refreshToken?: string;
  isVerified: boolean;
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  email?: string;
  age?: number;
  avatar?: string;
  bio?: {
    content: string;
    interests?: string[];
  };
  birth_date?: string;
  profile_photos?: string[];
  latitude?: number;
  longitude?: number;
  distance?: number;
  last_seen?: string;
  created_at?: string;
  updated_at?: string;
  is_verified?: boolean;
  verification_status?: VerificationStatus;
  show_distance?: boolean;
  show_online_status?: boolean;
  show_last_seen?: boolean;
  interests?: string[];
  occupation?: string;
  education?: string;
  relationship_type?: RelationshipType;
  gender?: Gender;
  looking_for?: Gender[];
  rating?: number;
  total_transactions?: number;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  conversationId: string;
  type: MessageType;
  isRead: boolean;
  metadata?: Record<string, any>;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  sellerId: string;
  seller: User;
  category: string;
  condition: ProductCondition;
  location: UserLocation;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  users: [string, string];
  timestamp: Date;
  isActive: boolean;
  conversationId?: string;
  lastActivity?: Date;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: Date;
  address?: string;
  city?: string;
  country?: string;
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface AppError {
  code: string;
  message: string;
  timestamp: Date;
  details?: Record<string, any>;
}

// =================================================================
// Enums
// =================================================================

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  NONE = 'none',
}

export enum RelationshipType {
  CASUAL = 'casual',
  SERIOUS = 'serious',
  FRIENDSHIP = 'friendship',
  NETWORKING = 'networking',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
  OTHER = 'other',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  LOCATION = 'location',
  SYSTEM = 'system',
}

export enum ProductCondition {
  NEW = 'new',
  LIKE_NEW = 'like_new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
}

// =================================================================
// Extended Types for Complex Features
// =================================================================

export interface UserPreferences {
  show_distance: boolean;
  show_online_status: boolean;
  show_last_seen: boolean;
  max_distance: number;
  age_range: {
    min: number;
    max: number;
  };
  push_notifications: boolean;
  location_sharing: boolean;
  language: string;
  theme: 'light' | 'dark' | 'auto';
}

export interface UserProfile extends User {
  preferences: UserPreferences;
  photos: ProfilePhoto[];
  social_links?: SocialLink[];
  stats: {
    profile_views: number;
    matches_count: number;
    messages_sent: number;
    products_sold: number;
  };
}

export interface ProfilePhoto {
  id: string;
  url: string;
  thumbnail_url?: string;
  is_primary: boolean;
  order: number;
  created_at: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  username?: string;
  is_verified: boolean;
}

export interface ChatConversation {
  id: string;
  participants: User[];
  lastMessage: Message | null;
  unreadCount: number;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  age_range?: {
    min: number;
    max: number;
  };
  interests?: string[];
  relationship_type?: RelationshipType[];
  verification_status?: VerificationStatus;
}

export interface MarketplaceFilters {
  category?: string;
  price_range?: {
    min: number;
    max: number;
  };
  condition?: ProductCondition[];
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  search_term?: string;
}

// =================================================================
// Utility Types
// =================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireAtLeastOne<T> = { [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>> }[keyof T];
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

// Helper function to create AppError instances
export const createAppError = (code: string, message: string, details?: Record<string, any>): AppError => ({
  code,
  message,
  timestamp: new Date(),
  details,
});

// Type guards
export const isUser = (obj: any): obj is User => {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
};

export const isAuthUser = (obj: any): obj is AuthUser => {
  return isUser(obj) && typeof obj.token === 'string';
};

export const isMessage = (obj: any): obj is Message => {
  return obj && typeof obj.id === 'string' && typeof obj.content === 'string';
};

export const isProduct = (obj: any): obj is Product => {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string' && typeof obj.price === 'number';
};
