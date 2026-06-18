import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create(
  persist(
    (set) => ({
      chats: [],
      activeChatId: null,

      initChats: () => {},

      startNewChat: () => {
        set({ activeChatId: null });
      },

      selectChat: (chatId) => {
        set({ activeChatId: chatId });
      },

      createTempChat: ({ message, assistantRole }) => {
        const tempId = crypto.randomUUID();

        const chat = {
          id: tempId,
          backendChatId: null,
          title: "Новый чат",
          messages: [message],
          assistantRole,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          chats: [chat, ...state.chats],
          activeChatId: tempId,
        }));

        return tempId;
      },

      addMessageToChat: (chatId, message) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, messages: [...chat.messages, message] }
              : chat,
          ),
        }));
      },

      updateChatMeta: (chatId, updates) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, ...updates } : chat,
          ),
        }));
      },

      updateMessage: (chatId, messageId, content) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id !== chatId) return chat;

            return {
              ...chat,
              messages: chat.messages.map((message) =>
                message.id === messageId ? { ...message, content } : message,
              ),
            };
          }),
        }));
      },
    }),
    {
      name: "chat-storage",
    },
  ),
);
