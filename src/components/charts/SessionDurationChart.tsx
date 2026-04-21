import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSessionDuration } from '../../hooks/useChartData';
import { CHART_HEIGHT, ID_DISPLAY_LENGTH } from '../../constants';

export function SessionDurationChart() {
  const { data, isLoading, isError } = useSessionDuration();

  if (isLoading) return <div className="animate-pulse h-64 bg-gray-100 rounded" />;
  if (isError) return <p className="text-red-500 text-sm">Failed to load data.</p>;
  if (!data?.length) return <p className="text-gray-500 text-sm">No session duration data yet</p>;

  const chartData = [...data]
    .sort((a, b) => b.durationMinutes - a.durationMinutes)
    .map((d) => ({
      session: d.sessionId.slice(0, ID_DISPLAY_LENGTH),
      durationMinutes: d.durationMinutes,
      agent: d.agent,
      repos: d.repos.join(', '),
    }));

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" unit=" min" tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="session" tick={{ fontSize: 10 }} width={70} />
        <Tooltip
          formatter={(value) => [`${value} min`, 'Duration']}
          labelFormatter={(label) => `Session: ${String(label)}`}
        />
        <Bar dataKey="durationMinutes" fill="#10b981" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
