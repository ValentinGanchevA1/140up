import MapScreen from '../screens/main/MapScreen';
import ChatListScreen from '../screens/social/ChatListScreen';
import SwipeScreen from '../screens/dating/SwipeScreen';
import MarketplaceScreen from '../screens/trading/MarketplaceScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import type React from 'react';
import { RootTabParamList } from '@/types';
import Icon from 'react-native-vector-icons/MaterialIcons';

// FIX: Use the `ReturnType` utility to correctly infer the icon names
// from the object returned by the `getRawGlyphMap` function.
type MaterialIconName = keyof ReturnType<typeof Icon.getRawGlyphMap>;

export type TabConfig = {
  name: keyof RootTabParamList;
  component: React.ComponentType<any>;
  iconName: MaterialIconName;
  label: string;
};

export const TabScreens: TabConfig[] = [
  {
    name: 'Map',
    component: MapScreen,
    iconName: 'map',
    label: 'Map',
  },
  {
    name: 'Chat',
    component: ChatListScreen,
    iconName: 'chat',
    label: 'Chats',
  },
  {
    name: 'Dating',
    component: SwipeScreen,
    iconName: 'favorite',
    label: 'Dating',
  },
  {
    name: 'Marketplace',
    component: MarketplaceScreen,
    iconName: 'shopping-cart',
    label: 'Market',
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    iconName: 'person',
    label: 'Profile',
  },
];
