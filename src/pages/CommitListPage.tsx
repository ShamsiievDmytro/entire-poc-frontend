import { useNavigate } from 'react-router-dom';
import { useGitAiCommits } from '../hooks/useChartData';
import { REPO_PREFIX } from '../constants';

const REPO_COLORS: Record<string, string> = {
  'entire-poc-backend': 'bg-indigo-100 text-indigo-800',
  'entire-poc-frontend': 'bg-amber-100 text-amber-800',
  'entire-poc-workspace': 'bg-green-100 text-green-800',
};

function formatDate(value: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function CommitListPage() {
  const { data, isLoading, isError } = useGitAiCommits();
  const navigate = useNavigate();

  if (isLoading) return <div className="max-w-7xl mx-auto px-6 py-6"><div className="animate-pulse h-64 bg-gray-100 rounded" /></div>;
  if (isError) return <div className="max-w-7xl mx-auto px-6 py-6"><p className="text-red-500 text-sm">Failed to load commits.</p></div>;
  if (!data?.length) return <div className="max-w-7xl mx-auto px-6 py-6"><p className="text-gray-500 text-sm">No Git AI commit data yet.</p></div>;

  return (
    <main className="max-w-7xl mx-auto px-6 py-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        All Commits ({data.length})
        <span className="ml-2 inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">Git AI</span>
      </h2>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-2">Commit</th>
              <th className="px-4 py-2">Repo</th>
              <th className="px-4 py-2">Agent %</th>
              <th className="px-4 py-2 text-right">AI Lines</th>
              <th className="px-4 py-2 text-right">Human</th>
              <th className="px-4 py-2">Agent</th>
              <th className="px-4 py-2">Model</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr
                key={`${c.commit_sha}-${c.repo}`}
                onClick={() => navigate(`/commits/${c.commit_sha}`)}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-2 font-mono text-xs">{c.commit_sha.slice(0, 7)}</td>
                <td className="px-4 py-2">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${REPO_COLORS[c.repo] ?? 'bg-gray-100 text-gray-800'}`}>
                    {c.repo.replace(REPO_PREFIX, '')}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${c.agent_percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{c.agent_percentage.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-right font-medium text-blue-700">{c.agent_lines}</td>
                <td className="px-4 py-2 text-right text-gray-500">{c.human_lines}</td>
                <td className="px-4 py-2 text-xs">{c.agent}</td>
                <td className="px-4 py-2 text-xs text-gray-500">{c.model}</td>
                <td className="px-4 py-2 text-xs text-gray-500">{formatDate(c.captured_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
