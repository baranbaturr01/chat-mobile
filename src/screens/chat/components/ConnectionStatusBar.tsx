import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ConnectionStatus} from '../../../services/websocket/types';
import {Colors, FontSize, Spacing} from '../../../constants/colors';

interface ConnectionStatusBarProps {
  status: ConnectionStatus;
  reconnectAttempt?: number;
}

const STATUS_CONFIG: Record<
  ConnectionStatus,
  {label: string; color: string; bgColor: string}
> = {
  connected: {
    label: '● Online',
    color: '#FFFFFF',
    bgColor: Colors.primary,
  },
  connecting: {
    label: '◌ Connecting…',
    color: '#FFFFFF',
    bgColor: Colors.warning,
  },
  reconnecting: {
    label: '↺ Reconnecting…',
    color: '#FFFFFF',
    bgColor: Colors.warning,
  },
  disconnected: {
    label: '○ Offline',
    color: '#FFFFFF',
    bgColor: Colors.offline,
  },
  error: {
    label: '✕ Connection error',
    color: '#FFFFFF',
    bgColor: Colors.error,
  },
};

export const ConnectionStatusBar = memo<ConnectionStatusBarProps>(
  ({status, reconnectAttempt}) => {
    if (status === 'connected') {
      return null;
    }

    const config = STATUS_CONFIG[status];
    const label =
      status === 'reconnecting' && reconnectAttempt
        ? `${config.label} (attempt ${reconnectAttempt})`
        : config.label;

    return (
      <View style={[styles.container, {backgroundColor: config.bgColor}]}>
        <Text style={[styles.text, {color: config.color}]}>{label}</Text>
      </View>
    );
  },
);

ConnectionStatusBar.displayName = 'ConnectionStatusBar';

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
