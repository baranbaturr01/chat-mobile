import api, {removeToken} from './api';
import type {User} from '../types/user';

export interface UpdateAvatarPayload {
  uri: string;
  type: string;
  fileName: string;
}

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/api/auth/me');
  return response.data;
};

export const updateAvatar = async (
  payload: UpdateAvatarPayload,
): Promise<User> => {
  const formData = new FormData();
  formData.append('avatar', {
    uri: payload.uri,
    type: payload.type,
    name: payload.fileName,
  } as unknown as Blob);

  const response = await api.patch<User>('/api/auth/me/avatar', formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/api/auth/logout');
  } finally {
    await removeToken();
  }
};
