import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import * as Keychain from 'react-native-keychain';

const BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

const TOKEN_SERVICE = 'chat_mobile_auth';
const TOKEN_KEY = 'access_token';

export const saveToken = async (token: string): Promise<void> => {
  await Keychain.setGenericPassword(TOKEN_KEY, token, {
    service: TOKEN_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};

export const getToken = async (): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword({
    service: TOKEN_SERVICE,
  });
  return credentials ? credentials.password : null;
};

export const removeToken = async (): Promise<void> => {
  await Keychain.resetGenericPassword({service: TOKEN_SERVICE});
};

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await removeToken();
    }
    return Promise.reject(error);
  },
);

export default api;
