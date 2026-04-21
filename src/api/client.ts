const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3001';

const API_TIMEOUT_MS = 30_000;

async function get<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${path}`, { signal: controller.signal });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`${res.status} ${res.statusText}: ${body}`);
    }
    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

async function post<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${path}`, { method: 'POST', signal: controller.signal });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`${res.status} ${res.statusText}: ${body}`);
    }
    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// Types matching backend response shapes
export interface StatusResponse {
  version?: string;
  patternVersion?: string;
  lastRun: string | null;
  repos: string[];
  sessionCount: number;
  checkpointCount: number;
  linkCount: number;
  gitAiTest?: boolean;
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

export interface FilesPerSessionPoint {
  sessionId: string;
  filesCount: number;
}

export interface SessionDurationPoint {
  sessionId: string;
  durationMinutes: number;
  agent: string;
  repos: string[];
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
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | null;
}

// Git AI types
export interface GitAiCommit {
  repo: string;
  commit_sha: string;
  agent: string;
  model: string | null;
  agent_lines: number;
  human_lines: number;
  agent_percentage: number;
  prompt_id: string | null;
  files_touched_json: string | null;
  raw_note_json: string | null;
  captured_at: string | null;
  ingested_at: string;
}

export interface GitAiSummary {
  total: number;
  byRepo: { repo: string; commits: number; avg_agent_pct: number; total_agent_lines: number; total_human_lines: number }[];
  byAgent: { agent: string; commits: number; avg_pct: number }[];
}

export interface EntireVsGitAiRow {
  commit_sha: string;
  repo: string;
  gitai_agent: string | null;
  gitai_model: string | null;
  gitai_agent_lines: number | null;
  gitai_human_lines: number | null;
  gitai_agent_pct: number | null;
  gitai_files: string | null;
  entire_agent_pct: number | null;
  entire_agent_lines: number | null;
  entire_files: string | null;
  link_confidence: string | null;
  link_reason: string | null;
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
    filesPerSession: () => get<FilesPerSessionPoint[]>('/api/charts/files-per-session'),
    sessionDuration: () => get<SessionDurationPoint[]>('/api/charts/session-duration'),
  },
  sessions: {
    crossRepo: () => get<CrossRepoSession[]>('/api/sessions/cross-repo'),
  },
  gitai: {
    commits: () => get<GitAiCommit[]>('/api/gitai/commits'),
    summary: () => get<GitAiSummary>('/api/gitai/summary'),
    compare: () => get<EntireVsGitAiRow[]>('/api/compare/entire-vs-gitai'),
  },
};
