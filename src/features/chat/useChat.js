import { useMutation, useQuery } from "@tanstack/react-query";
import { chatApi } from "../../shared/api/chatApi.js";

export const useChats = () =>
  useQuery({
    queryKey: ["chats"],
    queryFn: chatApi.getChats,
  });

export const useChatMessages = (chatId) =>
  useQuery({
    queryKey: ["chat-messages", chatId],
    queryFn: () => chatApi.getChatMessages(chatId),
    enabled: Boolean(chatId),
  });

export const useSendMessage = () =>
  useMutation({
    mutationFn: chatApi.sendMessage,
  });

export const useMessageResult = () =>
  useMutation({
    mutationFn: chatApi.getMessageResult,
  });