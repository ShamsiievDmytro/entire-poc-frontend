import { Doughnut } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { CHART_HEIGHT } from '../../lib/chartDefaults';

// Colorblind-friendly palette — high contrast, distinct hues
const MODEL_COLORS = [
  '#2563eb', // blue
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#ec4899', // pink
];

interface DataPoint {
  model: string;
  commits: number;
}

export function ModelDistribution({ data }: { data: DataPoint[] }) {
  if (!data.length) return <p className="text-gray-500 text-sm">No data yet</p>;

  const total = data.reduce((sum, d) => sum + d.commits, 0);

  const chartData = {
    labels: data.map((d) => d.model),
    datasets: [
      {
        data: data.map((d) => d.commits),
        backgroundColor: MODEL_COLORS.slice(0, data.length),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const count = ctx.parsed;
            const pct = ((count / total) * 100).toFixed(1);
            return `${ctx.label}: ${count} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: CHART_HEIGHT }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
