import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAppDispatch } from '@/store/store';
import { initApp } from '@/store/slices/appSlice'; // Add this import
import LocationService from './../services/LocationService';
import {PushNotificationService} from '@/services/push/PushNotificationService';
import { handleServiceError } from '@/utils/errorHandler';

export const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeServices = async () => {
      try {
        await Promise.allSettled([
          LocationService.initialize(),
          PushNotificationService.initialize?.()
        ]);

        // Dispatch initApp action after services are initialized
        dispatch(initApp());
      } catch (error) {
        handleServiceError(error, 'Service initialization failed');
      } finally {
        setIsReady(true);
      }
    };

    initializeServices();

    return () => {
      LocationService.cleanup?.();
      PushNotificationService.cleanup?.();
    };
  }, [dispatch]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
};
