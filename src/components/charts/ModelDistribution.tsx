import { Doughnut } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { COLORS, CHART_HEIGHT } from '../../lib/chartDefaults';

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
        backgroundColor: COLORS.accent.slice(0, data.length),
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
