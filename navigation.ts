// src/types/navigation.ts
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined; // Added for completeness
};

export type RootTabParamList = {
  Map: undefined;
  Chat: { userId?: string; conversationId?: string };
  Dating: { userId?: string };
  Marketplace: { category?: string };
  Profile: { userId?: string; isEditing?: boolean };
};

// Defines the root navigation stack, which decides between Auth and Main flows
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<RootTabParamList>;
};

export type TabNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList>,
    NativeStackNavigationProp<RootStackParamList>
>;

export type AuthScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Auth'
>;

export type MainScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Main'
>;
