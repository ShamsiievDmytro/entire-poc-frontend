import { IngestionStatus } from './IngestionStatus';
import { CrossRepoSessionMap } from './CrossRepoSessionMap';
import { SessionsOverTimeChart } from './charts/SessionsOverTimeChart';
import { AgentPercentageChart } from './charts/AgentPercentageChart';
import { SlashCommandsChart } from './charts/SlashCommandsChart';
import { ToolUsageMixChart } from './charts/ToolUsageMixChart';
import { FrictionPerSessionChart } from './charts/FrictionPerSessionChart';
import { OpenItemsPerSessionChart } from './charts/OpenItemsPerSessionChart';

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">Entire PoC Dashboard</h1>
        <p className="text-sm text-gray-500">Pattern C Validation — Cross-Repo Session Capture (Scenario 3 tested)</p>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <IngestionStatus />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="Sessions Over Time (Chart 1)">
            <SessionsOverTimeChart />
          </ChartCard>
          <ChartCard title="Agent % per Commit (Chart 4)">
            <AgentPercentageChart />
          </ChartCard>
          <ChartCard title="Slash Command Frequency (Chart 14)">
            <SlashCommandsChart />
          </ChartCard>
          <ChartCard title="Tool Usage Mix (Chart 21)">
            <ToolUsageMixChart />
          </ChartCard>
          <ChartCard title="Friction per Session (Chart 25)">
            <FrictionPerSessionChart />
          </ChartCard>
          <ChartCard title="Open Items per Session (Chart 26)">
            <OpenItemsPerSessionChart />
          </ChartCard>
        </div>

        <ChartCard title="Cross-Repo Session Map">
          <CrossRepoSessionMap />
        </ChartCard>
      </main>

      <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-6 text-center">
        <p className="text-sm text-gray-500">Entire Pattern C Validation PoC</p>
      </footer>
    </div>
  );
}
