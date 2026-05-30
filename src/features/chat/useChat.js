import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../shared/api/mockApi.js';

export const useChats = () => useQuery({ queryKey: ['chats'], queryFn: api.getChats });
export const useSendMessage = () => useMutation({ mutationFn: api.sendChatMessage });
