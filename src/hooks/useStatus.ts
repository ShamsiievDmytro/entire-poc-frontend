import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { POLL_INTERVAL_MS } from '../constants';

export function useStatus() {
  return useQuery({
    queryKey: ['status'],
    queryFn: api.status,
    refetchInterval: POLL_INTERVAL_MS,
  });
}

export function useTriggerIngest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.triggerIngest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status'] });
      queryClient.invalidateQueries({ queryKey: ['charts'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: (err) => {
      console.error('Ingestion trigger failed:', err);
    },
  });
}
