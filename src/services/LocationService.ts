import { Alert, Linking, Platform } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
} from 'react-native-permissions';

// --- Custom Error for Location Service ---
/**
 * Custom error class for location-specific issues, allowing for
 * more granular error handling by consumers.
 */
export class LocationError extends Error {
  constructor(
    public readonly code: 'UNAVAILABLE' | 'PERMISSION_DENIED' | 'NOT_INITIALIZED',
    message: string,
  ) {
    super(message);
    this.name = 'LocationError';
  }
}

// --- Centralized Geolocation Options ---
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 1000,
  distanceFilter: 10, // For watchPosition
};

/**
 * A static service class to manage all geolocation functionalities,
 * including permission handling, one-time fetching, and continuous tracking.
 */
export class LocationService {
  private static watchId: number | null = null;
  private static _permissionsGranted: boolean = false;

  /**
   * Checks for permissions and prompts the user if necessary.
   * This is the core of the service's robustness.
   */
  private static async _checkAndRequestPermissions(): Promise<boolean> {
    const permission = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    });

    // This should not happen on a real device, but it's a good safeguard.
    if (!permission) {
      console.error('Location permission configuration is missing for this platform.');
      return false;
    }

    const status: PermissionStatus = await check(permission);

    if (status === RESULTS.GRANTED) {
      return true;
    }

    if (status === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Required',
        'Location access is blocked. To use this feature, please enable location permissions for this app in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
      return false;
    }

    // If status is 'denied' or 'limited', we can request it.
    const requestStatus: PermissionStatus = await request(permission);
    return requestStatus === RESULTS.GRANTED;
  }

  /**
   * Initializes the LocationService. It must be called once when the app
   * starts (e.g., in AppInitializer) to ensure permissions are ready.
   * @throws {LocationError} if permissions are not granted.
   */
  static async initialize(): Promise<void> {
    console.log('LocationService initializing...');
    this._permissionsGranted = await this._checkAndRequestPermissions();

    if (!this._permissionsGranted) {
      throw new LocationError(
        'PERMISSION_DENIED',
        'Location permissions were not granted by the user.',
      );
    }
    console.log('LocationService initialized successfully.');
  }

  /**
   * A Promise-based wrapper to get the user's current location once.
   * @throws {LocationError} if service is not initialized or geolocation is unavailable.
   * @returns A Promise that resolves with GeolocationPosition or rejects with GeolocationPositionError.
   */
  static getCurrentLocation(): Promise<GeolocationPosition> {
    if (!this._permissionsGranted) {
      return Promise.reject(
        new LocationError('NOT_INITIALIZED', 'LocationService.initialize() must be called before using this method.'),
      );
    }
    if (!navigator.geolocation) {
      return Promise.reject(
        new LocationError('UNAVAILABLE', 'Geolocation is not supported by this browser or environment.'),
      );
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => resolve(position),
        (error: GeolocationPositionError) => reject(error),
        {
          enableHighAccuracy: GEOLOCATION_OPTIONS.enableHighAccuracy,
          timeout: GEOLOCATION_OPTIONS.timeout,
          maximumAge: GEOLOCATION_OPTIONS.maximumAge,
        },
      );
    });
  }

  /**
   * Starts watching the user's position for real-time updates.
   *
   * @param onPositionChange Callback function for successful position updates.
   * @param onError Callback function for handling errors.
   * @returns The watchId, which can be used to manually stop the watch, or null if failed.
   */
  static watchPosition(
    onPositionChange: (position: GeolocationPosition) => void,
    onError: (error: GeolocationPositionError | LocationError) => void,
  ): number | null {
    if (!this._permissionsGranted) {
      onError(new LocationError('NOT_INITIALIZED', 'LocationService.initialize() must be called before using this method.'));
      return null;
    }
    if (!navigator.geolocation) {
      onError(new LocationError('UNAVAILABLE', 'Geolocation is not supported by this browser or environment.'));
      return null;
    }

    // Clear any existing watch before starting a new one
    this.clearWatch();

    this.watchId = navigator.geolocation.watchPosition(
      onPositionChange,
      onError,
      GEOLOCATION_OPTIONS,
    );

    return this.watchId;
  }

  /**
   * Stops watching the user's position.
   */
  static clearWatch(): void {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      console.log('Location watch cleared.');
    }
  }

  /**
   * Cleans up the service, ensuring any active location watches are stopped.
   */
  static cleanup(): void {
    this.clearWatch();
    console.log('LocationService cleaned up.');
  }
}

// Export a default instance for convenience to maintain compatibility with existing imports.
export default LocationService;
