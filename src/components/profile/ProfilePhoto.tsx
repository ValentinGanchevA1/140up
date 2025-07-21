import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { User } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';

interface ProfilePhotoProps {
  user: User;
  size?: number;
  isOnline?: boolean;
  showOnlineStatus?: boolean;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  user,
  size = 100,
  isOnline = false,
  showOnlineStatus = true,
}) => {
  const photoUri = user.profile_photos?.[0] || user.avatar;
  const hasPhoto = !!photoUri;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {hasPhoto ? (
        <Image source={{ uri: photoUri }} style={[styles.image, { borderRadius: size / 2 }]} />
      ) : (
        <View style={[styles.placeholder, { borderRadius: size / 2 }]}>
          <MaterialIcons name="person" size={size * 0.6} color="#ccc" />
        </View>
      )}
      {showOnlineStatus && (
        <View
          style={[
            styles.onlineIndicator,
            { backgroundColor: isOnline ? '#4CAF50' : '#FFC107' },
            { width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125 },
            { borderWidth: size * 0.03 },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderColor: '#fff',
    borderWidth: 2,
  },
}); 

export default ProfilePhoto;