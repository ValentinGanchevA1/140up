import {
	RegisterRequest,
	AuthResponse,
	LoginRequest,
	User,
	ApiErrorResponse, Gender, VerificationStatus, RelationshipType,
} from '@/types';
import { v4 as uuidv4 } from 'uuid'; // A library to generate mock IDs

// Helper to create a mock user for API responses
const createMockUser = (
	credentials: RegisterRequest | LoginRequest,
	overrides: Partial<User> = {},
): {
	id: string;
	name: any | string;
	email: any | string;
	age: number | undefined;
	is_verified: boolean;
	created_at: string;
	updated_at: string;
	profile_photos: string[];
	token?: any;
	avatar?: string;
	bio?: { content: string; interests?: string[] };
	birth_date?: string;
	latitude?: number;
	longitude?: number;
	distance?: number;
	last_seen?: string;
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
	total_transactions?: number
} => ({
	id: uuidv4(),
	name: 'name' in credentials ? credentials.name : 'Mock User',
	email: credentials.email,
	// A simple age calculation for the mock
	age: 'birth_date' in credentials ? 25 : undefined,
	is_verified: false,
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
	profile_photos: ['https://i.pravatar.cc/300'], // Placeholder avatar
	...overrides,
});

/**
 * Simulates a user registration API call, aligning with the RegisterResponse type.
 * @param credentials The user's full registration details from RegisterRequest.
 * @returns A promise that resolves with the standard API response shape.
 */
export const register = (credentials: RegisterRequest): Promise<AuthResponse> => {
	return new Promise((resolve, reject) => {
		// Simulate network delay
		// eslint-disable-next-line no-console
		console.log('Attempting to register with:', credentials);
		setTimeout(() => {
			// Simulate a common validation error
			if (!credentials.name || credentials.password.length < 8) {
				const errorResponse: ApiErrorResponse = {
					success: false,
					error: {
						code: 'invalid_input',
						message: 'Name is required and password must be at least 8 characters.',
					},
					timestamp: new Date().toISOString(),
				};
				// Reject with a structured error object
				return reject(errorResponse);
			}

			const user = createMockUser(credentials);
			const response: AuthResponse = {
				success: true,
				data: {
					user,
					token: `mock_jwt_token_for_${user.id}`,
				},
				timestamp: new Date().toISOString(),
			};
			resolve(response);
		}, 1200);
	});
};

/**
 * Simulates a user login API call, aligning with the expected response type.
 * @param credentials The user's login details from LoginRequest.
 * @returns A promise that resolves with the standard API response shape.
 */
export const login = (credentials: LoginRequest): Promise<AuthResponse> => {
	return new Promise((resolve, reject) => {
		// eslint-disable-next-line no-console
		console.log('Attempting to log in with:', credentials.email); // Simulate network delay
		setTimeout(() => {
			// Simulate an incorrect password for testing error states
			if (credentials.password !== 'password123') {
				const errorResponse: ApiErrorResponse = {
					success: false,
					error: {
						code: 'unauthorized',
						message: 'Invalid email or password.',
					},
					timestamp: new Date().toISOString(),
				};
				return reject(errorResponse);
			}

			const user = createMockUser(credentials, { name: 'Returning User' });
			const response: AuthResponse = {
				success: true,
				data: {
					user,
					token: `mock_jwt_token_for_${user.id}`,
				},
				timestamp: new Date().toISOString(),
			};
			resolve(response);
		}, 800);
	});
};
