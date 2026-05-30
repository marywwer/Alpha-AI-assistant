import { useQuery } from '@tanstack/react-query';
import { api } from '../../shared/api/mockApi.js';

export const useMeetings = () => useQuery({ queryKey: ['meetings'], queryFn: api.getMeetings });
