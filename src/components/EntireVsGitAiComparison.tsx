import { useEntireVsGitAi } from '../hooks/useChartData';
import { REPO_PREFIX } from '../constants';

function SourceBadge({ source }: { source: 'Entire' | 'Git AI' }) {
  const cls = source === 'Git AI'
    ? 'bg-blue-100 text-blue-800'
    : 'bg-purple-100 text-purple-800';
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${cls}`}>
      {source}
    </span>
  );
}

export function EntireVsGitAiComparison() {
  const { data, isLoading, isError } = useEntireVsGitAi();

  if (isLoading) return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  if (isError) return <p className="text-red-500 text-sm">Failed to load comparison data.</p>;
  if (!data?.length) return <p className="text-gray-500 text-sm">No comparison data yet</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="pb-2 pr-3">Commit</th>
            <th className="pb-2 pr-3">Repo</th>
            <th className="pb-2 pr-3 text-center">
              <SourceBadge source="Git AI" /> Lines
            </th>
            <th className="pb-2 pr-3 text-center">
              <SourceBadge source="Git AI" /> %
            </th>
            <th className="pb-2 pr-3 text-center">
              <SourceBadge source="Entire" /> %
            </th>
            <th className="pb-2 pr-3">Link</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={`${row.commit_sha}-${row.repo}`} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-1.5 pr-3 font-mono">{row.commit_sha.slice(0, 7)}</td>
              <td className="py-1.5 pr-3">
                <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                  {row.repo.replace(REPO_PREFIX, '')}
                </span>
              </td>
              <td className="py-1.5 pr-3 text-center">
                {row.gitai_agent_lines != null ? (
                  <span>{row.gitai_agent_lines} AI / {row.gitai_human_lines} human</span>
                ) : (
                  <span className="text-gray-300">--</span>
                )}
              </td>
              <td className="py-1.5 pr-3 text-center font-medium">
                {row.gitai_agent_pct != null ? (
                  <span className="text-blue-700">{row.gitai_agent_pct.toFixed(1)}%</span>
                ) : (
                  <span className="text-gray-300">--</span>
                )}
              </td>
              <td className="py-1.5 pr-3 text-center">
                {row.entire_agent_pct != null ? (
                  <span className="text-purple-700">{row.entire_agent_pct.toFixed(1)}%</span>
                ) : (
                  <span className="text-gray-300">--</span>
                )}
              </td>
              <td className="py-1.5 pr-3">
                {row.link_confidence ? (
                  <span className={`text-xs ${
                    row.link_confidence === 'HIGH' ? 'text-green-600' :
                    row.link_confidence === 'MEDIUM' ? 'text-amber-600' : 'text-gray-400'
                  }`}>
                    {row.link_confidence}
                  </span>
                ) : (
                  <span className="text-gray-300">--</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
