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

export interface GitAiFileAttribution {
  file: string;
  promptId: string;
  lineRanges: string;
  lineCount: number;
}

export interface GitAiLocalPrompt {
  prompt_id: string;
  session_id: string;
  workdir: string | null;
  tool: string;
  model: string;
  human_author: string | null;
  total_additions: number | null;
  total_deletions: number | null;
  accepted_lines: number | null;
  overridden_lines: number | null;
  message_preview: string | null;
  message_bytes: number;
  created_at: string;
  updated_at: string;
}

export interface GitAiCommitDetail {
  commit_sha: string;
  repo: string;
  captured_at: string | null;
  attribution: {
    agent: string;
    model: string | null;
    agent_lines: number;
    human_lines: number;
    overridden_lines: number;
    agent_percentage: number;
    prompt_id: string | null;
  };
  files: GitAiFileAttribution[];
  raw_note: string | null;
  local_prompt: GitAiLocalPrompt | null;
}

export interface GitAiDashboardData {
  summary: {
    total_commits: number;
    avg_agent_pct: number;
    pure_ai_commit_rate: number;
    first_time_right_rate: number;
    total_ai_lines: number;
    total_human_lines: number;
    total_overridden_lines: number;
    ai_pct: number;
    human_pct: number;
    overridden_pct: number;
  };
  agent_pct_over_time: { commit_sha: string; repo: string; agent_percentage: number; captured_at: string | null }[];
  attribution_breakdown: { commit_sha: string; repo: string; ai_pct: number; human_pct: number; overridden_pct: number; agent_lines: number; human_lines: number; overridden_lines: number; captured_at: string | null }[];
  by_developer: { author: string; commits: number; ai_lines: number; human_lines: number; overridden_lines: number; ai_pct: number; human_pct: number; overridden_pct: number }[];
  by_model: { model: string; commits: number }[];
  ai_human_rate_by_day: { day: string; ai_lines: number; human_lines: number; overridden_lines: number; ai_pct: number; human_pct: number; overridden_pct: number }[];
}

export const api = {
  status: () => get<StatusResponse>('/api/status'),
  triggerIngest: () => post<{ jobId: string }>('/api/ingest/run'),
  gitai: {
    commits: () => get<GitAiCommit[]>('/api/gitai/commits'),
    dashboard: () => get<GitAiDashboardData>('/api/gitai/dashboard'),
    commitDetail: (sha: string) => get<GitAiCommitDetail>(`/api/gitai/commits/${sha}/detail`),
    transcriptUrl: (sha: string, promptId: string) =>
      `${BASE}/api/gitai/commits/${sha}/transcript?prompt_id=${encodeURIComponent(promptId)}`,
  },
};
