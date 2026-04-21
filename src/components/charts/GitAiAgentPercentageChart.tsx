import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useGitAiCommits } from '../../hooks/useChartData';
import { CHART_HEIGHT, REPO_PREFIX } from '../../constants';

const REPO_COLORS: Record<string, string> = {
  'entire-poc-backend': '#6366f1',
  'entire-poc-frontend': '#f59e0b',
  'entire-poc-workspace': '#10b981',
};

export function GitAiAgentPercentageChart() {
  const { data, isLoading, isError } = useGitAiCommits();

  if (isLoading) return <div className="animate-pulse h-64 bg-gray-100 rounded" />;
  if (isError) return <p className="text-red-500 text-sm">Failed to load data.</p>;
  if (!data?.length) return <p className="text-gray-500 text-sm">No Git AI attribution data yet</p>;

  const chartData = data.map((d) => ({
    label: `${d.commit_sha.slice(0, 7)} ${d.repo.replace(REPO_PREFIX, '')}`,
    agentPct: d.agent_percentage,
    repo: d.repo,
    agent: d.agent,
    model: d.model,
    agentLines: d.agent_lines,
    humanLines: d.human_lines,
  }));

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
        <YAxis type="category" dataKey="label" tick={{ fontSize: 9 }} width={80} />
        <Tooltip
          formatter={(value: number) => `${value.toFixed(1)}%`}
          labelFormatter={(label: string) => label}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div className="bg-white border border-gray-200 rounded shadow-sm p-2 text-xs">
                <p className="font-semibold">{d.label}</p>
                <p>Agent: {d.agent} ({d.model})</p>
                <p>AI lines: {d.agentLines} / Human: {d.humanLines}</p>
                <p className="font-medium">{d.agentPct.toFixed(1)}% AI</p>
              </div>
            );
          }}
        />
        <Bar dataKey="agentPct" radius={[0, 4, 4, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={REPO_COLORS[entry.repo] || '#94a3b8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
