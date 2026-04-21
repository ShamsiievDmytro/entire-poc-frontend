import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { COLORS, CHART_HEIGHT } from '../../lib/chartDefaults';

interface DataPoint {
  layer: string;
  ai_lines: number;
  human_lines: number;
}

export function FilesByLayer({ data }: { data: DataPoint[] }) {
  if (!data.length) return <p className="text-gray-500 text-sm">No data yet</p>;

  const chartData = {
    labels: data.map((d) => d.layer),
    datasets: [
      {
        label: 'AI Lines',
        data: data.map((d) => d.ai_lines),
        backgroundColor: COLORS.ai,
      },
      {
        label: 'Human Lines',
        data: data.map((d) => d.human_lines),
        backgroundColor: COLORS.human,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, grid: { color: COLORS.grid } },
    },
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  return (
    <div style={{ height: CHART_HEIGHT }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
