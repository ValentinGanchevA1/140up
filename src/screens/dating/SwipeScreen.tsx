import React, {useState} from 'react';
import {View, StyleSheet, Text, Animated} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from './../../types';
import {UserCard} from 'components/UserCard';
import {mockUsers} from '../../mockData/mockUsers';

type SwipeScreenProps = BottomTabScreenProps<MainTabParamList, 'Dating'>;
type SwipeDirection = 'left' | 'right';

const ANIMATION_CONSTANTS = {
  SWIPE_DISTANCE: 500,
  RESET_POSITION: {x: 0, y: 0}
} as const;

const useSwipeAnimation = (onSwipeComplete: () => void) => {
  const [swipeAnimation] = useState(new Animated.ValueXY());

  const executeSwipeAnimation = (direction: SwipeDirection) => {
    const targetPosition = {
      x: direction === 'right' ? ANIMATION_CONSTANTS.SWIPE_DISTANCE : -ANIMATION_CONSTANTS.SWIPE_DISTANCE,
      y: 0
    };

    Animated.spring(swipeAnimation, {
      toValue: targetPosition,
      useNativeDriver: true
    }).start(() => {
      onSwipeComplete();
      swipeAnimation.setValue(ANIMATION_CONSTANTS.RESET_POSITION);
    });
  };

  return {
    swipeAnimation,
    executeSwipeAnimation
  };
};

const SwipeScreen: React.FC<SwipeScreenProps> = () => {
  const [availableUsers, setAvailableUsers] = useState(mockUsers);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const handleSwipeComplete = () => {
    setCurrentUserIndex(prevIndex => prevIndex + 1);
  };

  const { swipeAnimation, executeSwipeAnimation } = useSwipeAnimation(handleSwipeComplete);

  const renderEmptyState = () => (
    <View style={[styles.container, styles.centerContent]}>
      <Text style={styles.noMoreText}>No more users to show</Text>
    </View>
  );

  const renderCurrentUser = () => (
    <View style={styles.container}>
      <Animated.View style={{transform: swipeAnimation.getTranslateTransform()}}>
        <UserCard
          user={availableUsers[currentUserIndex]}
          onSwipeLeft={() => executeSwipeAnimation('left')}
          onSwipeRight={() => executeSwipeAnimation('right')}
        />
      </Animated.View>
    </View>
  );

  const hasMoreUsers = currentUserIndex < availableUsers.length;

  return hasMoreUsers ? renderCurrentUser() : renderEmptyState();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  noMoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c757d'
  }
});

export default SwipeScreen;
