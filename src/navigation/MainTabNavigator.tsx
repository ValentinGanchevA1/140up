import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import the configuration and types
import { TabScreens } from './TabScreens';
import { tabBarOptions } from './TabBarConfig'; // This file now exists
import { RootTabParamList } from '@/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      {TabScreens.map(({ name, component, iconName, label }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarLabel: label,
            tabBarIcon: ({ color, size }) => (
              <Icon name={iconName} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
