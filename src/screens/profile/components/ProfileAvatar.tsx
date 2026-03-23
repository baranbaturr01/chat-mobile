import React, {memo} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProfileAvatarProps {
  uri?: string;
  onEditPress: () => void;
  isUploading: boolean;
  editLabel: string;
}

const AVATAR_SIZE = 100;
const PLACEHOLDER_COLOR = '#C8E6C9';
const PRIMARY = '#2E7D32';

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  uri,
  onEditPress,
  isUploading,
  editLabel,
}) => (
  <View style={styles.container}>
    <View style={styles.avatarWrapper}>
      {uri ? (
        <FastImage
          style={styles.avatar}
          source={{uri, priority: FastImage.priority.normal}}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Icon name="account" size={60} color={PRIMARY} />
        </View>
      )}
      {isUploading && (
        <View style={styles.uploadOverlay}>
          <ActivityIndicator color="#fff" />
        </View>
      )}
    </View>
    <TouchableOpacity
      style={styles.editButton}
      onPress={onEditPress}
      accessibilityLabel={editLabel}
      disabled={isUploading}>
      <Icon name="camera" size={16} color="#fff" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarPlaceholder: {
    backgroundColor: PLACEHOLDER_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default memo(ProfileAvatar);
