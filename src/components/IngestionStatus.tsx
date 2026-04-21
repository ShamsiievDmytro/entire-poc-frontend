import { useStatus, useTriggerIngest } from '../hooks/useStatus';

export function IngestionStatus() {
  const { data: status, isLoading } = useStatus();
  const ingest = useTriggerIngest();

  if (isLoading) return <div className="animate-pulse h-20 bg-gray-100 rounded" />;

  const lastRun = status?.lastRun
    ? new Date(status.lastRun).toLocaleString()
    : 'Never';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Ingestion Status</h2>
            <span className="text-xs text-gray-500">v{status?.version}</span>
            <span className="text-xs text-gray-500">{status?.patternVersion}</span>
        <button
          onClick={() => ingest.mutate()}
          disabled={ingest.isPending}
          className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
        >
          {ingest.isPending ? 'Running...' : 'Refresh'}
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
        <div>
          <span className="text-gray-500">Last Run</span>
          <p className="font-medium">{lastRun}</p>
        </div>
        <div>
          <span className="text-gray-500">Repos</span>
          <p className="font-medium">
            {status?.repos.map((r) => (
              <span key={r} className="inline-block mr-1 px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                {r.replace('entire-poc-', '')}
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
