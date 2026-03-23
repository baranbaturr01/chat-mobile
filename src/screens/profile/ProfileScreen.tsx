import React, {useCallback} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, CommonActions} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useLanguage} from '@/context/LanguageContext';
import {useProfile} from './hooks/useProfile';
import ProfileAvatar from './components/ProfileAvatar';
import ProfileInfo from './components/ProfileInfo';
import SettingsSection from './components/SettingsSection';
import type {RootStackParamList} from '@/navigation/types';
import type {Language} from '@/types/user';

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavProp>();
  const {t, language, setLanguage} = useLanguage();

  const {
    user,
    isLoading,
    isError,
    refetch,
    isPickerVisible,
    setPickerVisible,
    openGallery,
    openCamera,
    isUploadingAvatar,
    handleLogout,
  } = useProfile(t);

  const navigateToLogin = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  }, [navigation]);

  const onLogout = useCallback(() => {
    handleLogout(navigateToLogin);
  }, [handleLogout, navigateToLogin]);

  const onLanguageChange = useCallback(
    async (lang: Language) => {
      await setLanguage(lang);
    },
    [setLanguage],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>{t.common.loading}</Text>
      </SafeAreaView>
    );
  }

  if (isError || !user) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{t.profile.loadFailed}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refetch()}
          accessibilityRole="button">
          <Text style={styles.retryText}>{t.common.retry}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refetch}
            colors={['#2E7D32']}
            tintColor="#2E7D32"
          />
        }>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.profile.title}</Text>
        </View>

        <ProfileAvatar
          uri={user.avatar}
          onEditPress={() => setPickerVisible(true)}
          isUploading={isUploadingAvatar}
          editLabel={t.profile.editPhoto}
        />

        <ProfileInfo
          usernameLabel={t.profile.username}
          emailLabel={t.profile.email}
          username={user.username}
          email={user.email}
        />

        <SettingsSection
          t={t}
          currentLanguage={language}
          onLanguageChange={onLanguageChange}
          onLogout={onLogout}
        />
      </ScrollView>

      {/* Photo picker action sheet */}
      <Modal
        visible={isPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerVisible(false)}>
          <View style={styles.actionSheet}>
            <TouchableOpacity
              style={styles.actionSheetButton}
              onPress={openGallery}>
              <Text style={styles.actionSheetText}>{t.profile.choosePhoto}</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              style={styles.actionSheetButton}
              onPress={openCamera}>
              <Text style={styles.actionSheetText}>{t.profile.takePhoto}</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              style={styles.actionSheetButton}
              onPress={() => setPickerVisible(false)}>
              <Text style={[styles.actionSheetText, styles.cancelText]}>
                {t.profile.cancel}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  scroll: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1B5E20',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#2E7D32',
    fontSize: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34,
  },
  actionSheetButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  actionSheetText: {
    fontSize: 17,
    color: '#212121',
  },
  cancelText: {
    color: '#D32F2F',
    fontWeight: '600',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
});

export default ProfileScreen;
