import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import ProfilePhoto from './profile/ProfilePhoto';
import UserInfo from './profile/UserInfo';
import { UserStatus } from './profile/ProfileStatusUtils';
import {TouchableOpacity} from "react-native";

const ProfileCard = ({ userId, isCurrentUser = false }) => {
  const { user, isLoading, error } = useSelector((state: RootState) => ({
    user: isCurrentUser
      ? state.auth.user
      : (userId ? state.user.profiles[userId] : null),
    isLoading: state.user.loading,
    error: state.user.error
  }));

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message="Failed to load profile" />;
  if (!user) return <ErrorState message="Profile not found" />;

  const age = user.birth_date ? UserStatus.calculateAge(user.birth_date) : null;
  const isOnline = user.lastSeen
    ? UserStatus.isUserOnline(user.lastSeen)
    : false;

  return (
    <TouchableOpacity>
      <ProfilePhoto user={user} isOnline={isOnline} showOnlineStatus={false} />
      <UserInfo user={user} age={age} isOnline={false} showDistance={false} />
    </TouchableOpacity>
  );
};
