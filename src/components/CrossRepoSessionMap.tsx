import { useCrossRepoSessions } from '../hooks/useChartData';
import { truncateId } from '../utils/format';
import { REPO_PREFIX } from '../constants';

type Confidence = 'HIGH' | 'MEDIUM' | 'LOW';

function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const cls: Record<Confidence, string> = {
    HIGH: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls[confidence] || 'bg-gray-100 text-gray-600'}`}>
      {confidence}
    </span>
  );
}

export function CrossRepoSessionMap() {
  const { data, isLoading, isError } = useCrossRepoSessions();

  if (isLoading) return <div className="animate-pulse h-40 bg-gray-100 rounded" />;
  if (isError) return <p className="text-red-500 text-sm">Failed to load cross-repo sessions.</p>;
  if (!data?.length) return <p className="text-gray-500 text-sm">No cross-repo sessions yet</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="pb-2 pr-4">Session</th>
            <th className="pb-2 pr-4">Agent</th>
            <th className="pb-2 pr-4">Repos Touched</th>
            <th className="pb-2 pr-4">Linked Commits</th>
            <th className="pb-2">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s) => {
            const confidenceCounts = s.commits.reduce<Record<string, number>>((acc, c) => {
              acc[c.confidence] = (acc[c.confidence] || 0) + 1;
              return acc;
            }, {});

            return (
              <tr key={s.sessionId} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 pr-4 font-mono text-xs">{truncateId(s.sessionId)}</td>
                <td className="py-2 pr-4">{s.agent || '-'}</td>
                <td className="py-2 pr-4">
                  {s.repos.map((r) => (
                    <span key={r} className="inline-block mr-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                      {r.replace(REPO_PREFIX, '')}
                    </span>
                  ))}
                </td>
                <td className="py-2 pr-4">{s.commits.length}</td>
                <td className="py-2 space-x-1">
                  {Object.entries(confidenceCounts).map(([conf, count]) => (
                    <span key={conf}>
                      <ConfidenceBadge confidence={conf as Confidence} /> x{count}
                    </span>
                  ))}
                  {!s.commits.length && <span className="text-gray-400">-</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
