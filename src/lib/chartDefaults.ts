import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
);

ChartJS.defaults.font.family = 'ui-sans-serif, system-ui, sans-serif';
ChartJS.defaults.color = '#6b7280';
ChartJS.defaults.plugins.tooltip.backgroundColor = '#ffffff';
ChartJS.defaults.plugins.tooltip.titleColor = '#111827';
ChartJS.defaults.plugins.tooltip.bodyColor = '#374151';
ChartJS.defaults.plugins.tooltip.borderColor = '#e5e7eb';
ChartJS.defaults.plugins.tooltip.borderWidth = 1;
ChartJS.defaults.plugins.tooltip.padding = 12;
ChartJS.defaults.plugins.tooltip.cornerRadius = 8;
ChartJS.defaults.plugins.tooltip.boxPadding = 4;
ChartJS.defaults.plugins.legend.labels.usePointStyle = true;
ChartJS.defaults.plugins.legend.labels.pointStyle = 'circle';
ChartJS.defaults.animation = { duration: 300 };

export const COLORS = {
  ai: '#6366f1',
  human: '#10b981',
  aiFill: 'rgba(99, 102, 241, 0.1)',
  accent: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'],
  grid: '#f3f4f6',
};

export const CHART_HEIGHT = 280;
export const CHART_HEIGHT_WIDE = 320;
