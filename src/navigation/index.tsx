import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChatNavigator from './ChatNavigator';
import {Colors, FontSize} from '../constants/theme';

export type RootTabParamList = {
  Chats: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// Placeholder profile screen — replaced by Issue #5
const ProfileScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text style={{fontSize: 48, marginBottom: 16}}>👤</Text>
    <Text style={{fontSize: 18, fontWeight: '700', color: Colors.text}}>
      Profil
    </Text>
    <Text style={{fontSize: 14, color: Colors.textSecondary, marginTop: 8}}>
      Yakında kullanılabilir (Issue #5)
    </Text>
  </View>
);

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarStyle: {
            borderTopColor: Colors.border,
            backgroundColor: Colors.background,
          },
          tabBarLabelStyle: {
            fontSize: FontSize.xs + 1,
            fontWeight: '600',
          },
        }}>
        <Tab.Screen
          name="Chats"
          component={ChatNavigator}
          options={{
            tabBarLabel: 'Sohbetler',
            tabBarIcon: ({color, size}: {color: string; size: number}) => (
              <Text style={{fontSize: size, color}}>💬</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profil',
            tabBarIcon: ({color, size}: {color: string; size: number}) => (
              <Text style={{fontSize: size, color}}>👤</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
