import type {
  User,
  AuthUser, // Assuming this is defined and exported from 'types/index.ts'
  Message,
  Product,  // Assuming this is defined and exported from 'types/index.ts'
  Match,    // Assuming this is defined and exported from 'types/index.ts'
  UserLocation,
  AppError,
  Region,
} from './index';

// =================================================================
// Reusable & Foundational State Types
// =================================================================

/**
 * A general shape for state slices that handle asynchronous operations.
 */
export interface LoadingState {
  isLoading: boolean;
  error: AppError | null;
}

/**
 * Defines the set of supported languages in the application.
 * Using an enum improves type safety over using raw strings.
 */
export enum AppLanguage {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
}

/**
 * Represents the status of a required permission.
 */
export enum PermissionStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  PENDING = 'pending',
  UNAVAILABLE = 'unavailable', // e.g., hardware not available
}

/**
 * Represents a single chat conversation.
 */
export interface ChatConversation {
  id: string;
  participants: User[];
  lastMessage: Message | null;
  unreadCount: number;
}

// =================================================================
// State Slice Definitions
// =================================================================

/**
 * State for authentication, user session, and tokens.
 * This shape should align with the state managed in `authSlice.ts`.
 */
export interface AuthState extends LoadingState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
}

/**
 * State for other users' data, such as profiles and search results.
 * Data is normalized to prevent duplication and ensure consistency.
 */
export interface UserState extends LoadingState {
  // A cache of user profiles, keyed by user ID for O(1) lookups.
  profiles: Record<string, User>;
  // An array of user IDs for users found nearby.
  nearbyUserIds: string[];
}

/**
 * State for chat conversations and messages.
 * This slice is defined but not yet added to the root reducer in `store.ts`.
 */
export interface ChatState extends LoadingState {
  conversations: ChatConversation[];
  currentConversationId: string | null;
  // A record of messages, keyed by their conversation ID for efficient lookup.
  messages: Record<string, Message[]>;
}

/**
 * State for map-related data, including user location and nearby users.
 */
export interface MapState extends LoadingState {
  userLocation: UserLocation | null;
  region: Region | null;
  locationPermission: PermissionStatus;
}

/**
 * State for the dating feature, including potential matches and swipes.
 * This slice is defined but not yet added to the root reducer in `store.ts`.
 */
export interface DatingState extends LoadingState {
  potentialMatches: User[];
  matches: Match[];
  swipeQueue: User[];
  dailyLikes: {
    count: number;
    limit: number;
  };
}

/**
 * State for the marketplace feature.
 * This slice is defined but not yet added to the root reducer in `store.ts`.
 */
export interface MarketplaceState extends LoadingState {
  products: Product[];
  // A cache of products viewed by the user, keyed by product ID.
  productDetails: Record<string, Product>;
  filters: {
    category?: string;
    priceRange?: [number, number];
    searchTerm?: string;
  };
}

/**
 * State for global application settings and status.
 */
export interface AppState {
  isInitialized: boolean;
  isOnline: boolean;
  theme: 'light' | 'dark';
  language: AppLanguage; // Using the new enum for better type safety
}

// =================================================================
// Root State
// =================================================================

/**
 * The root state of the entire Redux store, combining all state slices.
 * NOTE: This interface must stay in sync with the `rootReducer` in `store.ts`.
 * Slices that are defined here but not yet implemented in the reducer have been commented out
 * to ensure type consistency across the application.
 */
export interface RootState {
  app: AppState;
  auth: AuthState;
  map: MapState;
  user: UserState;

  // The following slices are defined but not yet included in the root reducer.
  // To enable them, add their reducers to `combineReducers` in `store.ts` and uncomment here.
  // chat: ChatState;
  // dating: DatingState;
  // marketplace: MarketplaceState;
}
