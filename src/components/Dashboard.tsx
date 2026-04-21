import { IngestionStatus } from './IngestionStatus';
import { RepoLegend } from './RepoLegend';
import { CrossRepoSessionMap } from './CrossRepoSessionMap';
import { SessionsOverTimeChart } from './charts/SessionsOverTimeChart';
import { AgentPercentageChart } from './charts/AgentPercentageChart';
import { SlashCommandsChart } from './charts/SlashCommandsChart';
import { ToolUsageMixChart } from './charts/ToolUsageMixChart';
import { FrictionPerSessionChart } from './charts/FrictionPerSessionChart';
import { OpenItemsPerSessionChart } from './charts/OpenItemsPerSessionChart';
import { FilesPerSessionChart } from './charts/FilesPerSessionChart';
import { SessionDurationChart } from './charts/SessionDurationChart';
import { GitAiAgentPercentageChart } from './charts/GitAiAgentPercentageChart';
import { EntireVsGitAiComparison } from './EntireVsGitAiComparison';

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
    <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <IngestionStatus />

      <RepoLegend />

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
        <ChartCard title="Avg Files Touched per Session">
          <FilesPerSessionChart />
        </ChartCard>
        <ChartCard title="Session Duration">
          <SessionDurationChart />
        </ChartCard>
      </div>

      <ChartCard title="Cross-Repo Session Map">
        <CrossRepoSessionMap />
      </ChartCard>

      <div className="border-t-2 border-blue-200 pt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Git AI Attribution
          <span className="ml-2 inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">Git AI</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Agent % per Commit (Git AI — line-level)">
            <GitAiAgentPercentageChart />
          </ChartCard>
        </div>

        <ChartCard title="Entire vs Git AI — Side-by-Side Comparison">
          <EntireVsGitAiComparison />
        </ChartCard>
      </div>
    </main>
  );
}
