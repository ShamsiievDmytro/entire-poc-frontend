import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { COLORS, CHART_HEIGHT } from '../../lib/chartDefaults';

interface DataPoint {
  commit_sha: string;
  repo: string;
  human_pct: number;
  captured_at: string | null;
}

export function HumanEditRate({ data }: { data: DataPoint[] }) {
  if (!data.length) return <p className="text-gray-500 text-sm">No data yet</p>;

  const chartData = {
    labels: data.map((d) => d.commit_sha.slice(0, 7)),
    datasets: [
      {
        label: 'Human Edit %',
        data: data.map((d) => d.human_pct),
        backgroundColor: COLORS.human,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: {
        min: 0,
        max: 100,
        ticks: { callback: (v) => `${v}%` },
        grid: { color: COLORS.grid },
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
