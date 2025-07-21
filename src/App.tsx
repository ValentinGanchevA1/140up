// src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { store, persistor } from './store/store';
import { AppInitializer } from './components/AppInitializer';
import ErrorBoundary from './components/ErrorBoundary';
import MainTabNavigator from './navigation/MainTabNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { RootStackParamList, RootState } from './types';
import { PersistLoading } from './components/PersistLoading';

const RootStack = createNativeStackNavigator<RootStackParamList>();

/**
 * RootNavigator chooses which stack to render depending on authentication state.
 */
export const RootNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <RootStack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<PersistLoading />} persistor={persistor}>
          <AppInitializer>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </AppInitializer>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
