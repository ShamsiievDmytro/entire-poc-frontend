import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { COLORS, CHART_HEIGHT } from '../../lib/chartDefaults';

interface DataPoint {
  author: string;
  commits: number;
  ai_lines: number;
  human_lines: number;
  overridden_lines: number;
  ai_pct: number;
  human_pct: number;
  overridden_pct: number;
}

function truncateAuthor(author: string): string {
  const emailStart = author.indexOf(' <');
  if (emailStart > 0) return author.slice(0, emailStart);
  if (author.length > 25) return author.slice(0, 22) + '...';
  return author;
}

export function AiByDeveloper({ data }: { data: DataPoint[] }) {
  if (!data.length) return <p className="text-gray-500 text-sm">No data yet</p>;

  const sorted = [...data].sort((a, b) => b.ai_pct - a.ai_pct);

  const chartData = {
    labels: sorted.map((d) => `${truncateAuthor(d.author)} (${d.commits})`),
    datasets: [
      {
        label: 'AI %',
        data: sorted.map((d) => d.ai_pct),
        backgroundColor: COLORS.ai,
        borderRadius: 2,
      },
      {
        label: 'AI Modified %',
        data: sorted.map((d) => d.overridden_pct),
        backgroundColor: '#f59e0b',
        borderRadius: 2,
      },
      {
        label: 'Human %',
        data: sorted.map((d) => d.human_pct),
        backgroundColor: COLORS.human,
        borderRadius: 2,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        stacked: true,
        min: 0,
        max: 100,
        ticks: { callback: (v) => `${v}%` },
        grid: { color: COLORS.grid },
      },
      y: {
        stacked: true,
        grid: { display: false },
      },
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          title: (items) => {
            const idx = items[0]?.dataIndex;
            if (idx === undefined) return '';
            return sorted[idx].author;
          },
          afterBody: (items) => {
            const idx = items[0]?.dataIndex;
            if (idx === undefined) return '';
            const d = sorted[idx];
            return `AI: ${d.ai_lines} · Modified: ${d.overridden_lines} · Human: ${d.human_lines} lines`;
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
