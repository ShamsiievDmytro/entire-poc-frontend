import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFriction } from '../../hooks/useChartData';

export function FrictionPerSessionChart() {
  const { data, isLoading } = useFriction();

  if (isLoading) return <div className="animate-pulse h-64 bg-gray-100 rounded" />;
  if (!data?.length) return <p className="text-gray-500 text-sm">No friction data yet</p>;

  const chartData = data.map((d) => ({
    session: d.sessionId.slice(0, 8),
    count: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="session" tick={{ fontSize: 10 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
