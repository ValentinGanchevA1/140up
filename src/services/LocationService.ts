// src/services/LocationService.ts

/**
 * A static service class to manage all geolocation-related functionalities.
 * It provides methods for one-time location fetching and continuous tracking.
 */
export class LocationService {
  private static watchId: number | null = null;

  /**
   * Initializes the LocationService. This can be used for setup tasks
   * like checking permissions upfront if needed in the future.
   */
  static async initialize(): Promise<void> {
    console.log('LocationService initialized.');
    // In the future, you could pre-emptively check for permissions here.
    return Promise.resolve();
  }

  /**
   * A Promise-based wrapper to get the user's current location once.
   * @returns A Promise that resolves with GeolocationPosition or rejects with GeolocationPositionError.
   */
  static getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(this.createUnavailableError());
      }

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => resolve(position),
        (error: GeolocationPositionError) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
        }
      );
    });
  }

  /**
   * Starts watching the user's position for real-time updates.
   * Automatically clears any previously active watch.
   *
   * @param onPositionChange Callback function for successful position updates.
   * @param onError Callback function for handling errors.
   * @returns The watchId, which can be used to manually stop the watch.
   */
  static watchPosition(
    onPositionChange: (position: GeolocationPosition) => void,
    onError: (error: GeolocationPositionError) => void
  ): number | null {
    if (!navigator.geolocation) {
      onError(this.createUnavailableError());
      return null;
    }

    // Clear any existing watch before starting a new one
    if (this.watchId !== null) {
      this.clearWatch();
    }

    this.watchId = navigator.geolocation.watchPosition(
      onPositionChange,
      onError,
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10, // Update every 10 meters
      }
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
   * This is intended to be called when the app is backgrounded or closed.
   */
  static cleanup(): void {
    this.clearWatch();
    console.log('LocationService cleaned up.');
  }

  /**
   * Helper to create a standardized error when geolocation is unavailable.
   */
  private static createUnavailableError(): GeolocationPositionError {
    return {
      code: 2, // POSITION_UNAVAILABLE
      message: 'Geolocation is not supported by this browser or environment.',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    };
  }
}

// Export a default instance for convenience if you prefer that pattern,
// but the static class approach is clean and requires no instantiation.
export default LocationService;
