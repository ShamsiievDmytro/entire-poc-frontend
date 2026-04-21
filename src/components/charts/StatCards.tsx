interface StatCardsProps {
  avgAgentPct: number;
  pureAiCommitRate: number;
  firstTimeRightRate: number;
}

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-5 border-l-4 ${color}`}>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mt-1">{label}</p>
    </div>
  );
}

export function StatCards({ avgAgentPct, pureAiCommitRate, firstTimeRightRate }: StatCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        value={`${avgAgentPct.toFixed(1)}%`}
        label="Avg Agent Attribution"
        color="border-l-indigo-500"
      />
      <StatCard
        value={`${pureAiCommitRate.toFixed(1)}%`}
        label="Pure-AI Commit Rate"
        color="border-l-violet-500"
      />
      <StatCard
        value={`${firstTimeRightRate.toFixed(1)}%`}
        label="First-Time-Right Rate"
        color="border-l-emerald-500"
      />
    </div>
  );
}
