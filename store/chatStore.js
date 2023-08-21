import { create } from "zustand";

export const chatStore = create((set) => ({
  selectedChat: "",
  setSelectedChat: (data) => set(() => ({ selectedChat: data })),
  chats: [],
  setChats: (data) => set(() => ({ chats: data })),
  chatId: "",
  setChatId: (data) => set(() => ({ chatId: data })),
  notifications: [],
  setNotifications: (data) => set(() => ({ notifications: data })),
}));
