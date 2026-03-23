import {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';
import {
  fetchCurrentUser,
  updateAvatar,
  logout as logoutService,
} from '@/services/authService';
import useAuthStore from '@/store/authStore';
import type {User} from '@/types/user';
import type {TranslationKeys} from '@/i18n';

const QUERY_KEY = ['currentUser'] as const;

export const useProfile = (t: TranslationKeys) => {
  const queryClient = useQueryClient();
  const {setUser, clearAuth} = useAuthStore();
  const [isPickerVisible, setPickerVisible] = useState(false);

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery<User>({
    queryKey: QUERY_KEY,
    queryFn: fetchCurrentUser,
    retry: 1,
  });

  const avatarMutation = useMutation({
    mutationFn: updateAvatar,
    onSuccess: updatedUser => {
      queryClient.setQueryData<User>(QUERY_KEY, updatedUser);
      setUser(updatedUser);
      Alert.alert(t.common.ok, t.profile.photoUpdated);
    },
    onError: () => {
      Alert.alert(t.common.error, t.profile.photoUpdateFailed);
    },
  });

  const handlePickerResponse = useCallback(
    (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorCode) {
        return;
      }
      const asset = response.assets?.[0];
      if (!asset?.uri) {
        return;
      }
      avatarMutation.mutate({
        uri: asset.uri,
        type: asset.type ?? 'image/jpeg',
        fileName: asset.fileName ?? 'avatar.jpg',
      });
    },
    [avatarMutation],
  );

  const openGallery = useCallback(() => {
    setPickerVisible(false);
    const options = {mediaType: 'photo' as MediaType, quality: 0.8 as const};
    launchImageLibrary(options, handlePickerResponse);
  }, [handlePickerResponse]);

  const openCamera = useCallback(() => {
    setPickerVisible(false);
    const options = {mediaType: 'photo' as MediaType, quality: 0.8 as const};
    launchCamera(options, handlePickerResponse);
  }, [handlePickerResponse]);

  const handleLogout = useCallback(
    (onSuccess: () => void) => {
      Alert.alert(
        t.settings.logoutConfirmTitle,
        t.settings.logoutConfirmMessage,
        [
          {text: t.settings.logoutCancel, style: 'cancel'},
          {
            text: t.settings.logoutConfirm,
            style: 'destructive',
            onPress: async () => {
              await logoutService();
              clearAuth();
              onSuccess();
            },
          },
        ],
      );
    },
    [t, clearAuth],
  );

  return {
    user,
    isLoading,
    isError,
    refetch,
    isPickerVisible,
    setPickerVisible,
    openGallery,
    openCamera,
    isUploadingAvatar: avatarMutation.isPending,
    handleLogout,
  };
};
