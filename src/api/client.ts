// Validated: Pattern C cross-repo client
const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3001';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function post<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { method: 'POST' });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// Types matching backend response shapes
export interface StatusResponse {
  lastRun: string | null;
  repos: string[];
  sessionCount: number;
  checkpointCount: number;
  linkCount: number;
}

export interface SessionsOverTimePoint {
  date: string;
  count: number;
}

export interface AgentPercentagePoint {
  commit: string;
  repo: string;
  agentPercentage: number;
  committedAt: string;
}

export interface SlashCommandPoint {
  command: string;
  count: number;
}

export interface ToolUsagePoint {
  tool: string;
  count: number;
}

export interface FrictionPoint {
  sessionId: string;
  count: number;
  items: unknown[];
}

export interface OpenItemsPoint {
  sessionId: string;
  count: number;
  items: unknown[];
}

export interface CrossRepoCommit {
  repo: string;
  checkpointId: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceScore: number;
}

export interface CrossRepoSession {
  sessionId: string;
  startedAt: string;
  endedAt: string | null;
  agent: string | null;
  repos: string[];
  commits: CrossRepoCommit[];
  confidence: string | null;
}

export const api = {
  status: () => get<StatusResponse>('/api/status'),
  triggerIngest: () => post<{ jobId: string }>('/api/ingest/run'),
  charts: {
    sessionsOverTime: () => get<SessionsOverTimePoint[]>('/api/charts/sessions-over-time'),
    agentPercentage: () => get<AgentPercentagePoint[]>('/api/charts/agent-percentage'),
    slashCommands: () => get<SlashCommandPoint[]>('/api/charts/slash-commands'),
    toolUsage: () => get<ToolUsagePoint[]>('/api/charts/tool-usage'),
    friction: () => get<FrictionPoint[]>('/api/charts/friction'),
    openItems: () => get<OpenItemsPoint[]>('/api/charts/open-items'),
  },
  sessions: {
    crossRepo: () => get<CrossRepoSession[]>('/api/sessions/cross-repo'),
  },
};
