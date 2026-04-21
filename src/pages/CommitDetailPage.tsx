import { useParams, Link } from 'react-router-dom';
import { useCommitDetail } from '../hooks/useChartData';
import { api } from '../api/client';
import { REPO_PREFIX } from '../constants';

const REPO_BADGE: Record<string, string> = {
  'entire-poc-backend': 'bg-indigo-100 text-indigo-800',
  'entire-poc-frontend': 'bg-amber-100 text-amber-800',
  'entire-poc-workspace': 'bg-green-100 text-green-800',
};

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className={`rounded-lg border p-4 ${color}`}>
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function CommitDetailPage() {
  const { sha } = useParams<{ sha: string }>();
  const { data, isLoading, isError } = useCommitDetail(sha ?? '');

  if (isLoading) return <div className="max-w-7xl mx-auto px-6 py-6"><div className="animate-pulse h-96 bg-gray-100 rounded" /></div>;
  if (isError || !data) return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <Link to="/commits" className="text-indigo-600 text-sm hover:underline">&larr; Back to commits</Link>
      <p className="text-red-500 text-sm mt-4">Failed to load commit detail.</p>
    </div>
  );

  const { attribution, files, raw_note, local_prompt } = data;
  const noteparts = raw_note?.split('\n---\n') ?? [];
  const fileMapSection = noteparts[0] ?? '';
  const jsonSection = noteparts[1] ?? '';

  let formattedJson = jsonSection;
  try { formattedJson = JSON.stringify(JSON.parse(jsonSection), null, 2); } catch { /* use raw */ }

  return (
    <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Section A — Summary Header */}
      <div>
        <Link to="/commits" className="text-indigo-600 text-sm hover:underline">&larr; Back to commits</Link>

        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <h2 className="text-lg font-semibold font-mono">{data.commit_sha}</h2>
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${REPO_BADGE[data.repo] ?? 'bg-gray-100 text-gray-800'}`}>
            {data.repo.replace(REPO_PREFIX, '')}
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          {data.captured_at ? new Date(data.captured_at).toLocaleString() : '—'}
          {' · '}{attribution.agent}{attribution.model ? ` (${attribution.model})` : ''}
        </p>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <StatCard label="AI Lines" value={attribution.agent_lines} color="border-blue-200 bg-blue-50" />
          <StatCard label="Human Lines" value={attribution.human_lines} color="border-gray-200 bg-gray-50" />
          <StatCard label="Agent %" value={`${attribution.agent_percentage.toFixed(1)}%`} color="border-indigo-200 bg-indigo-50" />
        </div>
      </div>

      {/* Section B — File Attribution Map */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">File Attribution ({files.length} files)</h3>
        {files.length === 0 ? (
          <p className="text-gray-500 text-sm">No file-level attribution data.</p>
        ) : (
          <div className="space-y-2">
            {files.map((f, i) => {
              const totalForFile = f.lineCount + (attribution.human_lines > 0 ? Math.round(attribution.human_lines * f.lineCount / Math.max(attribution.agent_lines, 1)) : 0);
              const aiPct = totalForFile > 0 ? (f.lineCount / totalForFile) * 100 : 100;
              return (
                <div key={i} className="border border-gray-100 rounded p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-800">{f.file}</span>
                    <span className="text-xs text-gray-500">{f.lineCount} lines</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${aiPct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">Lines {f.lineRanges}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">prompt: {f.promptId}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section C — Raw Git Note */}
      {raw_note && (
        <details open className="bg-white border border-gray-200 rounded-lg p-4">
          <summary className="text-sm font-semibold text-gray-700 cursor-pointer">Raw Git Note</summary>
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">File Map</p>
              <pre className="bg-gray-50 border border-gray-200 rounded p-3 text-xs font-mono overflow-x-auto whitespace-pre">{fileMapSection}</pre>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">JSON Metadata</p>
              <pre className="bg-gray-50 border border-gray-200 rounded p-3 text-xs font-mono overflow-x-auto whitespace-pre">{formattedJson}</pre>
            </div>
          </div>
        </details>
      )}

      {/* Section D — Local Prompt Data */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Local Prompt Data</h3>
        {local_prompt ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div><span className="text-gray-500 text-xs">Session ID</span><p className="font-mono text-xs">{local_prompt.session_id}</p></div>
              <div><span className="text-gray-500 text-xs">Workdir</span><p className="font-mono text-xs truncate" title={local_prompt.workdir ?? ''}>{local_prompt.workdir}</p></div>
              <div><span className="text-gray-500 text-xs">Tool / Model</span><p className="text-xs">{local_prompt.tool} / {local_prompt.model}</p></div>
              <div><span className="text-gray-500 text-xs">Human Author</span><p className="text-xs">{local_prompt.human_author}</p></div>
              <div><span className="text-gray-500 text-xs">Created</span><p className="text-xs">{new Date(local_prompt.created_at).toLocaleString()}</p></div>
              <div><span className="text-gray-500 text-xs">Updated</span><p className="text-xs">{new Date(local_prompt.updated_at).toLocaleString()}</p></div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-2 bg-blue-50 rounded"><p className="text-xs text-gray-500">Additions</p><p className="font-bold text-sm">{local_prompt.total_additions ?? '—'}</p></div>
              <div className="text-center p-2 bg-red-50 rounded"><p className="text-xs text-gray-500">Deletions</p><p className="font-bold text-sm">{local_prompt.total_deletions ?? '—'}</p></div>
              <div className="text-center p-2 bg-green-50 rounded"><p className="text-xs text-gray-500">Accepted</p><p className="font-bold text-sm">{local_prompt.accepted_lines ?? '—'}</p></div>
              <div className="text-center p-2 bg-amber-50 rounded"><p className="text-xs text-gray-500">Overridden</p><p className="font-bold text-sm">{local_prompt.overridden_lines ?? '—'}</p></div>
            </div>

            {local_prompt.message_preview && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transcript Preview</p>
                <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs font-mono whitespace-pre-wrap">
                  {local_prompt.message_preview}
                  {local_prompt.message_bytes > 500 && <span className="text-gray-400">...</span>}
                </div>
              </div>
            )}

            {attribution.prompt_id && (
              <a
                href={api.gitai.transcriptUrl(data.commit_sha, attribution.prompt_id)}
                download
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
              >
                Download Full Transcript ({formatBytes(local_prompt.message_bytes)})
              </a>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Local prompt data not available (prompt may be from a different machine or session).</p>
        )}
      </div>
    </main>
  );
}
