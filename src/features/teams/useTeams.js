import { useQuery } from '@tanstack/react-query';
import { api } from '../../shared/api/mockApi.js';

export function useTeams() {
  return useQuery({ queryKey: ['teams'], queryFn: api.getTeams });
}
