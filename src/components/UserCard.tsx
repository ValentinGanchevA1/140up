import React, { memo } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { User } from '@/types';

// --- Constants for better maintainability and theming ---
const CONSTANTS = {
  colors: {
    like: '#4CAF50',
    dislike: '#FF3B30',
    verified: '#007AFF',
    primaryText: '#fff',
    secondaryText: '#fff',
    darkText: '#555',
    tagBackground: '#f0f0f0',
    tagText: '#555',
    placeholderIcon: '#999',
  },
  sizing: {
    cardHeight: 580,
    borderRadius: 20,
    actionButton: 56,
    actionIcon: 28,
    verifiedIcon: 20,
    placeholderAvatar: 140,
  },
} as const;

// --- Prop Interfaces ---
interface UserCardProps {
  user: User;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isLoading?: boolean;
}

// --- Sub-components for a cleaner structure ---

const UserInfo: React.FC<{ user: User; isOverlay: boolean }> = ({ user, isOverlay }) => {
  const displayName = user.name || 'Unknown User';
  const age = user.age ? `${user.age}` : '';
  const ageDistance = [age, user.distance && `${Math.round(user.distance)}km away`].filter(Boolean).join(' • ');
  const bio = typeof user.bio === 'string' ? user.bio : user.bio?.content || 'No bio available';

  const textStyle = isOverlay ? styles.textLight : styles.textDark;

  return (
    <View style={isOverlay ? styles.userInfoOverlay : styles.userInfoCentered}>
      <Text style={[styles.name, textStyle]} numberOfLines={1}>{displayName}</Text>
      {ageDistance && <Text style={[styles.ageDistance, textStyle]} numberOfLines={1}>{ageDistance}</Text>}
      {bio && <Text style={[styles.bio, textStyle]} numberOfLines={2}>{bio}</Text>}
    </View>
  );
};

const ActionButtons: React.FC<Pick<UserCardProps, 'onSwipeLeft' | 'onSwipeRight' | 'isLoading' | 'user'>> = ({
                                                                                                               onSwipeLeft,
                                                                                                               onSwipeRight,
                                                                                                               isLoading,
                                                                                                               user,
                                                                                                             }) => (
  <View style={styles.actionButtonsContainer}>
    <TouchableOpacity
      style={[styles.button, styles.dislikeButton]}
      onPress={onSwipeLeft}
      accessible
      accessibilityLabel={`Pass on ${user.name}'s profile`}
      accessibilityRole="button"
      disabled={isLoading}
    >
      <MaterialIcons name="close" size={CONSTANTS.sizing.actionIcon} color={CONSTANTS.colors.dislike} />
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.button, styles.likeButton]}
      onPress={onSwipeRight}
      accessible
      accessibilityLabel={`Like ${user.name}'s profile`}
      accessibilityRole="button"
      disabled={isLoading}
    >
      <MaterialIcons name="favorite" size={CONSTANTS.sizing.actionIcon} color={CONSTANTS.colors.like} />
    </TouchableOpacity>
  </View>
);

const InterestTags: React.FC<{ interests?: string[] }> = ({ interests }) => {
  if (!interests || interests.length === 0) return null;
  return (
    <View style={styles.interestTagsContainer}>
      {interests.slice(0, 3).map((interest, index) => (
        <View key={index} style={styles.interestTag}>
          <Text style={styles.interestText}>{interest}</Text>
        </View>
      ))}
      {interests.length > 3 && (
        <Text style={styles.moreInterests}>+{interests.length - 3} more</Text>
      )}
    </View>
  );
};

const LoadingSkeleton: React.FC = () => (
  <View style={[styles.card, styles.loadingCard]}>
    <ActivityIndicator size="large" color={CONSTANTS.colors.verified} />
  </View>
);

// --- Main Component ---

const UserCardComponent: React.FC<UserCardProps> = ({ user, onSwipeLeft, onSwipeRight, isLoading = false }) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const primaryPhoto = user.profile_photos?.[0] || user.avatar;

  return (
    <View style={styles.card}>
      {primaryPhoto ? (
        <ImageBackground
          source={{ uri: primaryPhoto }}
          style={styles.imageContainer}
          resizeMode="cover"
        >
          <View style={styles.gradientOverlay} />
          {user.is_verified && (
            <View style={styles.verificationBadge}>
              <MaterialIcons name="verified" size={CONSTANTS.sizing.verifiedIcon} color={CONSTANTS.colors.verified} />
            </View>
          )}
          <View style={styles.contentOverlay}>
            <UserInfo user={user} isOverlay />
            <ActionButtons user={user} onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} isLoading={isLoading} />
          </View>
        </ImageBackground>
      ) : (
        <View style={styles.placeholderContainer}>
          <View style={styles.avatarPlaceholder}>
            <MaterialIcons name="person" size={80} color={CONSTANTS.colors.placeholderIcon} />
          </View>
          <UserInfo user={user} isOverlay={false} />
          <ActionButtons user={user} onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} isLoading={isLoading} />
        </View>
      )}
      <InterestTags interests={user.interests} />
    </View>
  );
};

export const UserCard = memo(UserCardComponent);
UserCard.displayName = 'UserCard';

// --- Styles ---
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: CONSTANTS.sizing.borderRadius,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    height: CONSTANTS.sizing.cardHeight,
    marginHorizontal: 4,
  },
  loadingCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  verificationBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 4,
  },
  contentOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  avatarPlaceholder: {
    width: CONSTANTS.sizing.placeholderAvatar,
    height: CONSTANTS.sizing.placeholderAvatar,
    borderRadius: CONSTANTS.sizing.placeholderAvatar / 2,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoOverlay: {
    marginBottom: 20,
  },
  userInfoCentered: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  ageDistance: {
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  textLight: {
    color: CONSTANTS.colors.primaryText,
  },
  textDark: {
    color: CONSTANTS.colors.darkText,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    width: CONSTANTS.sizing.actionButton,
    height: CONSTANTS.sizing.actionButton,
    borderRadius: CONSTANTS.sizing.actionButton / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 2,
  },
  dislikeButton: {
    borderColor: CONSTANTS.colors.dislike,
  },
  likeButton: {
    borderColor: CONSTANTS.colors.like,
  },
  interestTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    paddingTop: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  interestTag: {
    backgroundColor: CONSTANTS.colors.tagBackground,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  interestText: {
    fontSize: 12,
    color: CONSTANTS.colors.tagText,
    fontWeight: '500',
  },
  moreInterests: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});
