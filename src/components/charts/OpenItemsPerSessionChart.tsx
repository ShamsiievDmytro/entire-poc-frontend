import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOpenItems } from '../../hooks/useChartData';
import { CHART_HEIGHT, ID_DISPLAY_LENGTH } from '../../constants';

export function OpenItemsPerSessionChart() {
  const { data, isLoading, isError } = useOpenItems();

  if (isLoading) return <div className="animate-pulse h-64 bg-gray-100 rounded" />;
  if (isError) return <p className="text-red-500 text-sm">Failed to load data.</p>;
  if (!data?.length) return <p className="text-gray-500 text-sm">No open items data yet</p>;

  const chartData = data.map((d) => ({
    session: d.sessionId.slice(0, ID_DISPLAY_LENGTH),
    count: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="session" tick={{ fontSize: 10 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
