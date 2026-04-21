import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { COLORS, CHART_HEIGHT } from '../../lib/chartDefaults';

interface DataPoint {
  author: string;
  commits: number;
  avg_agent_pct: number;
}

export function AiByDeveloper({ data }: { data: DataPoint[] }) {
  if (!data.length) return <p className="text-gray-500 text-sm">No data yet</p>;

  const chartData = {
    labels: data.map((d) => `${d.author} (${d.commits})`),
    datasets: [
      {
        label: 'Avg Agent %',
        data: data.map((d) => d.avg_agent_pct),
        backgroundColor: COLORS.ai,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        min: 0,
        max: 100,
        ticks: { callback: (v) => `${v}%` },
        grid: { color: COLORS.grid },
      },
      y: {
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div style={{ height: CHART_HEIGHT }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
