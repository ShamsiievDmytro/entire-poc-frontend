import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { COLORS, CHART_HEIGHT } from '../../lib/chartDefaults';

interface DataPoint {
  day: string;
  ai_lines: number;
  human_lines: number;
  ai_pct: number;
  human_pct: number;
}

function formatDay(day: string): string {
  const d = new Date(day);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function AiHumanRateByDay({ data }: { data: DataPoint[] }) {
  if (!data.length) return <p className="text-gray-500 text-sm">No data yet</p>;

  const chartData = {
    labels: data.map((d) => formatDay(d.day)),
    datasets: [
      {
        label: 'AI %',
        data: data.map((d) => d.ai_pct),
        backgroundColor: COLORS.ai,
        borderRadius: 2,
      },
      {
        label: 'Human %',
        data: data.map((d) => d.human_pct),
        backgroundColor: COLORS.human,
        borderRadius: 2,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: {
        stacked: true,
        min: 0,
        max: 100,
        ticks: { callback: (v) => `${v}%` },
        grid: { color: COLORS.grid },
      },
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          afterBody: (items) => {
            const idx = items[0]?.dataIndex;
            if (idx === undefined) return '';
            const d = data[idx];
            return `AI: ${d.ai_lines} lines · Human: ${d.human_lines} lines`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: CHART_HEIGHT }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
