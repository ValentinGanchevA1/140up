// src/components/PersistLoading.tsx
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { appStyles } from '@/styles/appStyles';

/**
 * Shows a loading indicator during state persistence rehydration.
 */
export const PersistLoading: React.FC = () => (
  <View style={appStyles.loadingContainer}>
    <ActivityIndicator size="large" />
  </View>
);
