import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { COLORS, CHART_HEIGHT } from '../../lib/chartDefaults';

interface DataPoint {
  commit_sha: string;
  repo: string;
  ai_pct: number;
  human_pct: number;
  overridden_pct: number;
  agent_lines: number;
  human_lines: number;
  overridden_lines: number;
  captured_at: string | null;
}

export function AttributionBreakdown({ data }: { data: DataPoint[] }) {
  if (!data.length) return <p className="text-gray-500 text-sm">No data yet</p>;

  const chartData = {
    labels: data.map((d) => d.commit_sha.slice(0, 7)),
    datasets: [
      {
        label: 'AI %',
        data: data.map((d) => d.ai_pct),
        backgroundColor: COLORS.ai,
        borderRadius: 2,
      },
      {
        label: 'AI Modified %',
        data: data.map((d) => d.overridden_pct),
        backgroundColor: '#f59e0b',
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
      x: { stacked: true, grid: { display: false }, ticks: { maxRotation: 0, maxTicksLimit: 15, font: { size: 10 } } },
      y: { stacked: true, min: 0, max: 100, ticks: { callback: (v) => `${v}%` }, grid: { color: COLORS.grid } },
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          afterBody: (items) => {
            const idx = items[0]?.dataIndex;
            if (idx === undefined) return '';
            const d = data[idx];
            return `AI: ${d.agent_lines} · Modified: ${d.overridden_lines} · Human: ${d.human_lines} lines`;
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
