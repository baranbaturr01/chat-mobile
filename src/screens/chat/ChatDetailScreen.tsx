import React, {useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useQuery} from '@tanstack/react-query';
import {chatService} from '../../services/chatService';
import {Colors, Spacing, FontSize, BorderRadius} from '../../constants/theme';
import {ChatStackParamList} from '../../navigation/ChatNavigator';

type ChatDetailRouteProp = RouteProp<ChatStackParamList, 'ChatDetail'>;
type NavigationProp = NativeStackNavigationProp<ChatStackParamList>;

const ChatDetailScreen: React.FC = () => {
  const route = useRoute<ChatDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const {roomId, roomName} = route.params;

  const {data: room, isLoading} = useQuery({
    queryKey: ['chatRoom', roomId],
    queryFn: () => chatService.getChatRoom(roomId),
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: roomName,
    });
  }, [navigation, roomName]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Room info header */}
      <View style={styles.roomInfoCard}>
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarText}>
            {roomName.slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.roomName}>{room?.name ?? roomName}</Text>
        {room?.description ? (
          <Text style={styles.description}>{room.description}</Text>
        ) : null}
        <Text style={styles.memberCount}>
          {room?.members?.length ?? 0} üye
        </Text>
      </View>

      {/* Placeholder message area */}
      <View style={styles.messagePlaceholder}>
        <Text style={styles.placeholderIcon}>💬</Text>
        <Text style={styles.placeholderTitle}>Gerçek zamanlı mesajlaşma</Text>
        <Text style={styles.placeholderText}>
          WebSocket entegrasyonu (Issue #4) ile mesajlaşma özelliği
          eklenecektir.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomInfoCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    color: Colors.white,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  roomName: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  memberCount: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  messagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  placeholderTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ChatDetailScreen;
