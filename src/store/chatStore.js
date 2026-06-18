import { create } from "zustand";
import { persist } from "zustand/middleware";

const createChat = () => ({
  id: crypto.randomUUID(),
  backendChatId: null, 
  title: "Новый чат",
  messages: [],
  assistantRole: null,
  createdAt: new Date().toISOString(),
});

export const useChatStore = create(
  persist(
    (set, get) => ({
      chats: [createChat()],
      activeChatId: null,

      initChats: () => {
        const { chats, activeChatId } = get();

        if (!activeChatId && chats.length > 0) {
          set({ activeChatId: chats[0].id });
        }
      },

      createNewChat: () => {
        const chat = createChat();

        set((state) => ({
          chats: [chat, ...state.chats],
          activeChatId: chat.id,
        }));
      },

      selectChat: (chatId) => {
        set({ activeChatId: chatId });
      },

      addMessage: (message, assistantRole = null) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id !== state.activeChatId) return chat;

            const isFirstUserMessage =
              chat.messages.length === 0 && message.role === "user";

            return {
              ...chat,

              title: isFirstUserMessage
                ? message.content.slice(0, 35)
                : chat.title,

              assistantRole:
                isFirstUserMessage && assistantRole
                  ? assistantRole
                  : chat.assistantRole,

              messages: [...chat.messages, message],
            };
          }),
        }));
      },

      updateMessage: (messageId, content) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id !== state.activeChatId) return chat;

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
