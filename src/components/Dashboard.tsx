import { IngestionStatus } from './IngestionStatus';
import { useGitAiDashboard } from '../hooks/useChartData';
import { StatCards } from './charts/StatCards';
import { AgentPctOverTime } from './charts/AgentPctOverTime';
import { AttributionBreakdown } from './charts/AttributionBreakdown';
import { AiByDeveloper } from './charts/AiByDeveloper';
import { ModelDistribution } from './charts/ModelDistribution';
import { AiHumanRateByDay } from './charts/AiHumanRateByDay';
import '../lib/chartDefaults';

function ChartCard({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-5 ${wide ? 'col-span-full' : ''}`}>
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}

export function Dashboard() {
  const { data, isLoading, isError } = useGitAiDashboard();

  if (isLoading) return (
    <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <IngestionStatus />
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-gray-100 rounded-lg" />
          <div className="h-24 bg-gray-100 rounded-lg" />
          <div className="h-24 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-80 bg-gray-100 rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-72 bg-gray-100 rounded-lg" />
          <div className="h-72 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </main>
  );

  if (isError) return (
    <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <IngestionStatus />
      <p className="text-red-500 text-sm">Failed to load dashboard data.</p>
    </main>
  );

  if (!data) return null;

  return (
    <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <IngestionStatus />

      <StatCards
        avgAgentPct={data.summary.avg_agent_pct}
        pureAiCommitRate={data.summary.pure_ai_commit_rate}
        firstTimeRightRate={data.summary.first_time_right_rate}
        aiPct={data.summary.ai_pct}
        humanPct={data.summary.human_pct}
        overriddenPct={data.summary.overridden_pct}
        totalAiLines={data.summary.total_ai_lines}
        totalHumanLines={data.summary.total_human_lines}
        totalOverriddenLines={data.summary.total_overridden_lines}
      />

      <ChartCard title="Agent % Over Time (3-commit rolling average)" wide>
        <AgentPctOverTime data={data.agent_pct_over_time} />
      </ChartCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Attribution Breakdown (% per Commit)">
          <AttributionBreakdown data={data.attribution_breakdown} />
        </ChartCard>
        <ChartCard title="AI Usage by Developer">
          <AiByDeveloper data={data.by_developer} />
        </ChartCard>
        <ChartCard title="Model Distribution">
          <ModelDistribution data={data.by_model} />
        </ChartCard>
        <ChartCard title="AI vs Human Rate by Day">
          <AiHumanRateByDay data={data.ai_human_rate_by_day} />
        </ChartCard>
      </div>
    </main>
  );
}
