import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

export function useStatus() {
  return useQuery({
    queryKey: ['status'],
    queryFn: api.status,
    refetchInterval: 30_000,
  });
}

export function useTriggerIngest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.triggerIngest,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
