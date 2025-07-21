import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';

// Define theme colors for a consistent look and feel
const THEME = {
  primary: '#007AFF',
  inactive: '#8e8e93',
  background: Platform.OS === 'ios' ? '#F9F9F9' : '#FFFFFF',
  border: '#D1D1D6',
};

/**
 * A centralized configuration object for the main tab bar's screen options.
 * This includes styles for active/inactive tabs, labels, and the bar itself.
 */
export const tabBarOptions: BottomTabNavigationOptions = {
  // Hide the header for all screens in the tab navigator by default.
  // Headers can be enabled on a per-screen basis if needed.
  headerShown: false,

  // Color for the icon and label of the active tab
  tabBarActiveTintColor: THEME.primary,

  // Color for the icon and label of inactive tabs
  tabBarInactiveTintColor: THEME.inactive,

  // Style object for the tab bar
  tabBarStyle: {
    backgroundColor: THEME.background,
    // Add a subtle top border on iOS, remove default elevation shadow on Android
    borderTopWidth: Platform.OS === 'ios' ? 0.5 : 0,
    borderTopColor: THEME.border,
    elevation: Platform.OS === 'android' ? 8 : 0,
    // Adjust height for different platforms to accommodate safe areas
    height: Platform.OS === 'ios' ? 90 : 65,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    paddingTop: 5,
  },

  // Style object for the tab label text
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: '500',
  },
};
