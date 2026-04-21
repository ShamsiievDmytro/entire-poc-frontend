import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSessionsOverTime } from '../../hooks/useChartData';
import { CHART_HEIGHT } from '../../constants';

export function SessionsOverTimeChart() {
  const { data, isLoading, isError } = useSessionsOverTime();

  if (isLoading) return <div className="animate-pulse h-64 bg-gray-100 rounded" />;
  if (isError) return <p className="text-red-500 text-sm">Failed to load data.</p>;
  if (!data?.length) return <p className="text-gray-500 text-sm">No session data yet</p>;

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
