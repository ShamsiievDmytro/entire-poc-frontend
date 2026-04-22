interface StatCardsProps {
  avgAgentPct: number;
  pureAiCommitRate: number;
  firstTimeRightRate: number;
  totalAiLines: number;
  totalHumanLines: number;
  totalOverriddenLines: number;
}

function StatCard({ value, label, color, sub }: { value: string; label: string; color: string; sub?: string }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-5 border-l-4 ${color}`}>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export function StatCards({ avgAgentPct, pureAiCommitRate, firstTimeRightRate, totalAiLines, totalHumanLines, totalOverriddenLines }: StatCardsProps) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
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
      <StatCard
        value={totalAiLines.toLocaleString()}
        label="AI Lines"
        color="border-l-indigo-400"
      />
      <StatCard
        value={totalHumanLines.toLocaleString()}
        label="Human Lines"
        color="border-l-emerald-400"
      />
      <StatCard
        value={totalOverriddenLines.toLocaleString()}
        label="AI Modified by Human"
        color="border-l-amber-500"
      />
    </div>
  );
}
