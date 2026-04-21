import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useToolUsage } from '../../hooks/useChartData';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function ToolUsageMixChart() {
  const { data, isLoading } = useToolUsage();

  if (isLoading) return <div className="animate-pulse h-64 bg-gray-100 rounded" />;
  if (!data?.length) return <p className="text-gray-500 text-sm">No tool usage data yet</p>;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="tool" cx="50%" cy="50%" outerRadius={90} label={({ name }) => String(name)}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
