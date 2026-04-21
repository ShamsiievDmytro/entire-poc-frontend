import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSlashCommands } from '../../hooks/useChartData';
import { CHART_HEIGHT } from '../../constants';

export function SlashCommandsChart() {
  const { data, isLoading, isError } = useSlashCommands();

  if (isLoading) return <div className="animate-pulse h-64 bg-gray-100 rounded" />;
  if (isError) return <p className="text-red-500 text-sm">Failed to load data.</p>;
  if (!data?.length) return <p className="text-gray-500 text-sm">No slash command data yet</p>;

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" allowDecimals={false} />
        <YAxis dataKey="command" type="category" tick={{ fontSize: 12 }} width={120} />
        <Tooltip />
        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
