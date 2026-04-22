import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { COLORS, CHART_HEIGHT } from '../../lib/chartDefaults';

interface DataPoint {
  author: string;
  commits: number;
  avg_agent_pct: number;
}

function truncateAuthor(author: string): string {
  // "Dmytro Shamsiiev <dmytro.shamsiiev@ventionteams.com>" → "Dmytro Shamsiiev..."
  const emailStart = author.indexOf(' <');
  if (emailStart > 0) return author.slice(0, emailStart);
  if (author.length > 25) return author.slice(0, 22) + '...';
  return author;
}

export function AiByDeveloper({ data }: { data: DataPoint[] }) {
  if (!data.length) return <p className="text-gray-500 text-sm">No data yet</p>;

  const sorted = [...data].sort((a, b) => b.avg_agent_pct - a.avg_agent_pct);

  const chartData = {
    labels: sorted.map((d) => `${truncateAuthor(d.author)} (${d.commits})`),
    datasets: [
      {
        label: 'Avg Agent %',
        data: sorted.map((d) => d.avg_agent_pct),
        backgroundColor: COLORS.ai,
        borderRadius: 4,
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
      tooltip: {
        callbacks: {
          title: (items) => {
            const idx = items[0]?.dataIndex;
            if (idx === undefined) return '';
            return sorted[idx].author;
          },
          label: (ctx) => `${ctx.parsed.x}% AI · ${sorted[ctx.dataIndex].commits} commits`,
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
