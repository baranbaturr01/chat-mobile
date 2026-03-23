/**
 * Chat Mobile App
 *
 * Entry point demonstrating the ChatScreen with WebSocket integration.
 * In production, replace the placeholder values with real auth/room data
 * and integrate with your navigation stack.
 */

import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {ChatScreen} from './src/screens/chat';
import {Colors} from './src/constants/colors';

// TODO: Replace with real values from authentication and navigation params
const DEMO_CONFIG = {
  chatRoomId: 'room-1',
  chatRoomName: 'General',
  currentUserId: 'user-1',
  currentUsername: 'Me',
  websocketUrl: 'wss://your-backend.example.com/ws',
  authToken: undefined as string | undefined,
};

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.primaryDark}
      />
      <ChatScreen
        chatRoomId={DEMO_CONFIG.chatRoomId}
        chatRoomName={DEMO_CONFIG.chatRoomName}
        currentUserId={DEMO_CONFIG.currentUserId}
        currentUsername={DEMO_CONFIG.currentUsername}
        websocketUrl={DEMO_CONFIG.websocketUrl}
        authToken={DEMO_CONFIG.authToken}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
});

export default App;
