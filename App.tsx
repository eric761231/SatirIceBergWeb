import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import ChatScreen from './src/screens/ChatScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
