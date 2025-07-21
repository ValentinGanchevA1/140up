import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import UserDot from '@/components/map/UserDot';
import { useLocationManager } from '@/hooks/useLocationManager';
import { handleLocationError } from '@/utils/locationUtils';
import type { User } from '@/types';
import type { TabNavigationProp } from '@/types/navigation';

interface MapScreenProps {
  navigation: TabNavigationProp;
}

const DEFAULT_REGION: Region = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const UserMarker = React.memo(({ user, onPress }) => (
  <Marker coordinate={{ latitude: user.latitude, longitude: user.longitude }} onPress={() => onPress(user)}>
    <UserDot user={user} size={36} />
  </Marker>
));

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { nearbyUsers, isLoading } = useSelector((state: RootState) => state.map);

  const {
    region,
    setRegion,
    isInitializing,
    locationError,
  } = useLocationManager(user, dispatch);

  // User interaction handlers
  const navigateToUserProfile = useCallback(
    (userId: string) => {
      if (!userId) {
        console.warn('Cannot navigate to profile: userId is required');
        return;
      }
      navigation.navigate('Profile', { userId });
    },
    [navigation],
  );

  const navigateToChat = useCallback((userId: string) => {
    if (!userId) {
      console.warn('Cannot navigate to chat: userId is required');
      return;
    }
    return navigation.navigate('Chat', { userId });
  }, [navigation]);


  const handleUserPress = useCallback((selectedUser: User) => {
    if (!selectedUser?.id) {
      console.warn('Selected user has no ID');
      return;
    }

    Alert.alert(
      selectedUser.name || 'Unknown User',
      'What would you like to do?',
      [
        { text: 'View Profile', onPress: () => navigateToUserProfile(selectedUser.id) },
        { text: 'Send Message', onPress: () => navigateToChat(selectedUser.id) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [navigateToUserProfile, navigateToChat]);

  const validUsers = useMemo(() => nearbyUsers.filter(
    user => user?.latitude && user?.longitude && !isNaN(user.latitude) && !isNaN(user.longitude)
  ), [nearbyUsers]);

  const markers = useMemo(() => validUsers.map(user => (
    <UserMarker key={user.id} user={user} onPress={handleUserPress} />
  )), [validUsers, handleUserPress]);

  // Handle location errors
  useEffect(() => {
    if (locationError) {
      handleLocationError(locationError);
    }
  }, [locationError]);

  if (isInitializing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton
        followsUserLocation={false}
        loadingEnabled
      >
        {markers}
      </MapView>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default MapScreen;
