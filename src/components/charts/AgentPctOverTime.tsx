import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { COLORS, CHART_HEIGHT_WIDE } from '../../lib/chartDefaults';

interface DataPoint {
  commit_sha: string;
  repo: string;
  agent_percentage: number;
  captured_at: string | null;
}

function rollingAverage(data: DataPoint[], window: number): number[] {
  return data.map((_, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    const sum = slice.reduce((acc, d) => acc + d.agent_percentage, 0);
    return sum / slice.length;
  });
}

export function AgentPctOverTime({ data }: { data: DataPoint[] }) {
  if (!data.length) return <p className="text-gray-500 text-sm">No data yet</p>;

  const smoothed = rollingAverage(data, 3);

  const chartData = {
    labels: data.map((d) => d.commit_sha.slice(0, 7)),
    datasets: [
      {
        label: 'Agent %',
        data: smoothed,
        borderColor: COLORS.ai,
        backgroundColor: COLORS.aiFill,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { callback: (v) => `${v}%` },
        grid: { color: COLORS.grid },
      },
      x: {
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div style={{ height: CHART_HEIGHT_WIDE }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
