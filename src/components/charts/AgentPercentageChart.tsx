import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAgentPercentage } from '../../hooks/useChartData';
import { CHART_HEIGHT, ID_DISPLAY_LENGTH } from '../../constants';

const REPO_COLORS: Record<string, string> = {
  'entire-poc-backend': '#6366f1',
  'entire-poc-frontend': '#f59e0b',
  'entire-poc-workspace': '#10b981',
};

export function AgentPercentageChart() {
  const { data, isLoading, isError } = useAgentPercentage();

  if (isLoading) return <div className="animate-pulse h-64 bg-gray-100 rounded" />;
  if (isError) return <p className="text-red-500 text-sm">Failed to load data.</p>;
  if (!data?.length) return <p className="text-gray-500 text-sm">No agent percentage data yet</p>;

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="commit" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(0, ID_DISPLAY_LENGTH)} />
        <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
        <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
        <Bar dataKey="agentPercentage" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.commit} fill={REPO_COLORS[entry.repo] || '#94a3b8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
