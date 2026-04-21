import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export function useGitAiDashboard() {
  return useQuery({ queryKey: ['gitai', 'dashboard'], queryFn: api.gitai.dashboard });
}

export function useGitAiCommits() {
  return useQuery({ queryKey: ['gitai', 'commits'], queryFn: api.gitai.commits });
}

export function useCommitDetail(sha: string) {
  return useQuery({
    queryKey: ['gitai', 'commit-detail', sha],
    queryFn: () => api.gitai.commitDetail(sha),
    enabled: !!sha,
  });
}
