import {create} from 'zustand';
import {ChatRoom} from '../types';

interface ChatState {
  rooms: ChatRoom[];
  selectedRoomId: string | null;
  isLoading: boolean;
  error: string | null;
  setRooms: (rooms: ChatRoom[]) => void;
  addRoom: (room: ChatRoom) => void;
  removeRoom: (id: string) => void;
  updateRoom: (room: ChatRoom) => void;
  selectRoom: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>(set => ({
  rooms: [],
  selectedRoomId: null,
  isLoading: false,
  error: null,

  setRooms: rooms => set({rooms}),

  addRoom: room =>
    set(state => ({
      rooms: [room, ...state.rooms],
    })),

  removeRoom: id =>
    set(state => ({
      rooms: state.rooms.filter(r => r.id !== id),
    })),

  updateRoom: room =>
    set(state => ({
      rooms: state.rooms.map(r => (r.id === room.id ? room : r)),
    })),

  selectRoom: id => set({selectedRoomId: id}),

  setLoading: isLoading => set({isLoading}),

  setError: error => set({error}),
}));
