import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export function useSessionsOverTime() {
  return useQuery({ queryKey: ['charts', 'sessions-over-time'], queryFn: api.charts.sessionsOverTime });
}

export function useAgentPercentage() {
  return useQuery({ queryKey: ['charts', 'agent-percentage'], queryFn: api.charts.agentPercentage });
}

export function useSlashCommands() {
  return useQuery({ queryKey: ['charts', 'slash-commands'], queryFn: api.charts.slashCommands });
}

export function useToolUsage() {
  return useQuery({ queryKey: ['charts', 'tool-usage'], queryFn: api.charts.toolUsage });
}

export function useFriction() {
  return useQuery({ queryKey: ['charts', 'friction'], queryFn: api.charts.friction });
}

export function useOpenItems() {
  return useQuery({ queryKey: ['charts', 'open-items'], queryFn: api.charts.openItems });
}

export function useFilesPerSession() {
  return useQuery({ queryKey: ['charts', 'files-per-session'], queryFn: api.charts.filesPerSession });
}

export function useSessionDuration() {
  return useQuery({ queryKey: ['charts', 'session-duration'], queryFn: api.charts.sessionDuration });
}

export function useCrossRepoSessions() {
  return useQuery({ queryKey: ['sessions', 'cross-repo'], queryFn: api.sessions.crossRepo });
}

export function useGitAiCommits() {
  return useQuery({ queryKey: ['gitai', 'commits'], queryFn: api.gitai.commits });
}

export function useGitAiSummary() {
  return useQuery({ queryKey: ['gitai', 'summary'], queryFn: api.gitai.summary });
}

export function useEntireVsGitAi() {
  return useQuery({ queryKey: ['gitai', 'compare'], queryFn: api.gitai.compare });
}
