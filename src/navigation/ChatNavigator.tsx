import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatDetailScreen from '../screens/chat/ChatDetailScreen';
import CreateChatScreen from '../screens/chat/CreateChatScreen';
import {Colors} from '../constants/theme';

export type ChatStackParamList = {
  ChatList: undefined;
  ChatDetail: {roomId: string; roomName: string};
  CreateChat: undefined;
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

const ChatNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerBackTitleVisible: false,
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}>
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          title: 'Sohbetler',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={({route}) => ({
          title: route.params.roomName,
        })}
      />
      <Stack.Screen
        name="CreateChat"
        component={CreateChatScreen}
        options={{
          title: 'Yeni Sohbet',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
