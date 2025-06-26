import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AppStateProvider } from './components/state/atoms';
import MainContainer from './components/navigation/MainContainer';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <MainContainer />
        <Toast />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
