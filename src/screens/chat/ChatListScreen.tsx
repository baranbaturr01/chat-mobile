import React, {useCallback} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ChatRoom} from '../../types';
import {useChats} from '../../hooks/useChats';
import ChatListItem from '../../components/chat/ChatListItem';
import EmptyState from '../../components/chat/EmptyState';
import {Colors, Spacing, FontSize, Shadow, BorderRadius} from '../../constants/theme';
import {ChatStackParamList} from '../../navigation/ChatNavigator';

type NavigationProp = NativeStackNavigationProp<ChatStackParamList>;

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {chatRooms, isLoading, isError, isRefreshing, refreshChatRooms} =
    useChats();

  const handleRoomPress = useCallback(
    (room: ChatRoom) => {
      navigation.navigate('ChatDetail', {roomId: room.id, roomName: room.name});
    },
    [navigation],
  );

  const handleCreateChat = useCallback(() => {
    navigation.navigate('CreateChat');
  }, [navigation]);

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<ChatRoom>) => (
      <ChatListItem room={item} onPress={handleRoomPress} />
    ),
    [handleRoomPress],
  );

  const keyExtractor = useCallback((item: ChatRoom) => item.id, []);

  const ItemSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Sohbetler yükleniyor...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Bir hata oluştu</Text>
        <Text style={styles.errorMessage}>
          Sohbetler yüklenirken hata oluştu.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={refreshChatRooms}
          accessibilityRole="button">
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={
          <EmptyState
            title="Henüz sohbet yok"
            message="Yeni bir sohbet başlatmak için + butonuna basın"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshChatRooms}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        contentContainerStyle={
          chatRooms.length === 0 ? styles.emptyContainer : undefined
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateChat}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Yeni sohbet oluştur">
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
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
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  errorTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  errorMessage: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 4,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  separator: {
    height: 0,
  },
  emptyContainer: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.md,
  },
  fabIcon: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 32,
    textAlign: 'center',
  },
});

export default ChatListScreen;
