import React, {memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {ChatRoom} from '../../types';
import {Colors, Spacing, FontSize, BorderRadius} from '../../constants/theme';

interface ChatListItemProps {
  room: ChatRoom;
  onPress: (room: ChatRoom) => void;
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Şimdi';
  } else if (diffMins < 60) {
    return `${diffMins}dk`;
  } else if (diffHours < 24) {
    return `${diffHours}sa`;
  } else if (diffDays === 1) {
    return 'Dün';
  } else if (diffDays < 7) {
    return `${diffDays}g`;
  }
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const ChatListItem: React.FC<ChatListItemProps> = ({room, onPress}) => {
  const hasUnread = (room.unreadCount ?? 0) > 0;
  const lastMessageTime = room.lastMessage
    ? formatTime(room.lastMessage.createdAt)
    : formatTime(room.updatedAt);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(room)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${room.name} sohbeti`}>
      <View style={styles.avatarContainer}>
        {room.avatar ? (
          <Image
            source={{uri: room.avatar}}
            style={styles.avatar}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitials}>{getInitials(room.name)}</Text>
          </View>
        )}
        {room.members.some(m => m.isOnline) && (
          <View style={styles.onlineBadge} />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text
            style={[styles.roomName, hasUnread && styles.roomNameBold]}
            numberOfLines={1}>
            {room.name}
          </Text>
          <Text style={[styles.time, hasUnread && styles.timeBold]}>
            {lastMessageTime}
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <Text
            style={[
              styles.lastMessage,
              hasUnread && styles.lastMessageBold,
            ]}
            numberOfLines={1}>
            {room.lastMessage
              ? room.lastMessage.content
              : 'Henüz mesaj yok'}
          </Text>
          {hasUnread && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {(room.unreadCount ?? 0) > 99 ? '99+' : room.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
  },
  avatarFallback: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roomName: {
    flex: 1,
    fontSize: FontSize.md + 1,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  roomNameBold: {
    fontWeight: '700',
  },
  time: {
    fontSize: FontSize.xs + 1,
    color: Colors.textSecondary,
  },
  timeBold: {
    color: Colors.primary,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: FontSize.sm + 1,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  lastMessageBold: {
    color: Colors.text,
    fontWeight: '500',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadCount: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
});

export default memo(ChatListItem);
