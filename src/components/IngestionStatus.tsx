import { useStatus, useTriggerIngest } from '../hooks/useStatus';
import { REPO_PREFIX } from '../constants';

function formatLastRun(value: string | null | undefined): string {
  if (!value) return 'Never';
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? 'Never' : parsed.toLocaleString();
}

export function IngestionStatus() {
  const { data: status, isLoading, isError } = useStatus();
  const ingest = useTriggerIngest();

  if (isLoading) return <div className="animate-pulse h-20 bg-gray-100 rounded" />;
  if (isError) return <p className="text-red-500 text-sm p-4">Failed to load ingestion status.</p>;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Ingestion Status</h2>
          {status?.version && <span className="text-xs text-gray-500">v{status.version}</span>}
          {status?.patternVersion && <span className="text-xs text-gray-500">{status.patternVersion}</span>}
          {status?.gitAiTest && <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">Git AI</span>}
        </div>
        <button
          onClick={() => ingest.mutate()}
          disabled={ingest.isPending}
          className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
        >
          {ingest.isPending ? 'Running...' : 'Refresh'}
        </button>
      </div>
      {ingest.isError && <p className="text-red-500 text-xs mb-2">Ingestion trigger failed. Try again.</p>}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
        <div>
          <span className="text-gray-500">Last Run</span>
          <p className="font-medium">{formatLastRun(status?.lastRun)}</p>
        </div>
        <div>
          <span className="text-gray-500">Repos</span>
          <p className="font-medium">
            {status?.repos.map((r) => (
              <span key={r} className="inline-block mr-1 px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                {r.replace(REPO_PREFIX, '')}
              </span>
            ))}
            {!status?.repos.length && <span className="text-gray-400">None</span>}
          </p>
        </div>
        <div>
          <span className="text-gray-500">Sessions</span>
          <p className="font-medium">{status?.sessionCount ?? 0}</p>
        </div>
        <div>
          <span className="text-gray-500">Checkpoints</span>
          <p className="font-medium">{status?.checkpointCount ?? 0}</p>
        </div>
        <div>
          <span className="text-gray-500">Links</span>
          <p className="font-medium">{status?.linkCount ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
