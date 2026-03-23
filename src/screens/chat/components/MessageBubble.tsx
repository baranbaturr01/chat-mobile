import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Message} from '../../../types/chat';
import {BorderRadius, Colors, FontSize, Spacing} from '../../../constants/colors';

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
}

function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  } catch {
    return '';
  }
}

export const MessageBubble = memo<MessageBubbleProps>(
  ({message, isSent}) => {
    const isOptimistic = message.id.startsWith('optimistic-');

    return (
      <View
        style={[
          styles.container,
          isSent ? styles.sentContainer : styles.receivedContainer,
        ]}>
        {!isSent && (
          <Text style={styles.senderName}>{message.senderUsername}</Text>
        )}
        <View
          style={[
            styles.bubble,
            isSent ? styles.sentBubble : styles.receivedBubble,
          ]}>
          <Text
            style={[
              styles.messageText,
              isSent ? styles.sentText : styles.receivedText,
            ]}>
            {message.content}
          </Text>
          <View style={styles.metaRow}>
            <Text
              style={[
                styles.timeText,
                isSent ? styles.sentMeta : styles.receivedMeta,
              ]}>
              {formatTime(message.createdAt)}
            </Text>
            {isSent && (
              <Text
                style={[styles.statusIcon, isOptimistic && styles.pendingIcon]}>
                {isOptimistic ? ' ○' : ' ✓'}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  },
);

MessageBubble.displayName = 'MessageBubble';

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs / 2,
    marginHorizontal: Spacing.sm,
    maxWidth: '80%',
  },
  sentContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  receivedContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs / 2,
    marginLeft: Spacing.xs,
  },
  bubble: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: 60,
  },
  sentBubble: {
    backgroundColor: Colors.sentBubble,
    borderBottomRightRadius: BorderRadius.sm,
  },
  receivedBubble: {
    backgroundColor: Colors.receivedBubble,
    borderBottomLeftRadius: BorderRadius.sm,
  },
  messageText: {
    fontSize: FontSize.md,
    lineHeight: 20,
  },
  sentText: {
    color: Colors.sentBubbleText,
  },
  receivedText: {
    color: Colors.receivedBubbleText,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  timeText: {
    fontSize: FontSize.xs,
  },
  sentMeta: {
    color: 'rgba(255,255,255,0.7)',
  },
  receivedMeta: {
    color: Colors.textHint,
  },
  statusIcon: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.9)',
  },
  pendingIcon: {
    color: 'rgba(255,255,255,0.5)',
  },
});
