import { request } from "./baseApi.js";

export const chatApi = {
  getChats: () => request("/chat/storyNames"),

  getChatMessages: (chatId) =>
    request(`/chat/messageStory?chatId=${chatId}`),

  sendMessage: ({ chatId, message, role, teamId }) =>
    request("/chat/message", {
      method: "POST",
      body: JSON.stringify({
        chatId: chatId ?? null,
        text: message,
        role,
        teamId,
      }),
    }),

  getMessageResult: (sessionId) =>
    request(`/chat/message?sessionId=${sessionId}`),
};