import {create} from 'zustand';
import type {User} from '../types/user';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthStore>(set => ({
  user: null,
  isAuthenticated: false,
  setUser: (user: User | null) =>
    set({user, isAuthenticated: user !== null}),
  clearAuth: () => set({user: null, isAuthenticated: false}),
}));

export default useAuthStore;
