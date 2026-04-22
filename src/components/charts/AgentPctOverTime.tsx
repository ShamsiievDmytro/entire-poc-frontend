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
    return Math.round(sum / slice.length * 10) / 10;
  });
}

function formatDate(value: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function AgentPctOverTime({ data }: { data: DataPoint[] }) {
  if (!data.length) return <p className="text-gray-500 text-sm">No data yet</p>;

  const smoothed = rollingAverage(data, 3);

  const chartData = {
    labels: data.map((d) => formatDate(d.captured_at)),
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
        ticks: { maxRotation: 45, maxTicksLimit: 12, font: { size: 10 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => {
            const idx = items[0]?.dataIndex;
            if (idx === undefined) return '';
            const d = data[idx];
            return `${d.commit_sha.slice(0, 7)} · ${formatDate(d.captured_at)}`;
          },
          label: (ctx) => `Agent: ${ctx.parsed.y}%`,
        },
      },
    },
  };

  return (
    <div style={{ height: CHART_HEIGHT_WIDE }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
