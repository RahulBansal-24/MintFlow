import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Info, Compass } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { MoneyOrbit } from '../components/MoneyOrbit';
import { BalanceHeroCard } from '../components/BalanceHeroCard';
import { DailyAllowanceCard } from '../components/DailyAllowanceCard';
import { HealthScoreCard } from '../components/HealthScoreCard';
import { SpendingDonutChart } from '../components/SpendingDonutChart';
import { UpcomingCommitmentsWidget } from '../components/UpcomingCommitmentsWidget';
import { SavingsGoalsWidget } from '../components/SavingsGoalsWidget';
import { RecentActivityWidget } from '../components/RecentActivityWidget';
import { MoneyInsightsWidget } from '../components/MoneyInsightsWidget';
import { NavigationPage } from '../components/Sidebar';

interface OverviewPageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenSimulator: () => void;
  onOpenAddTransaction: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigate,
  onOpenSimulator,
  onOpenAddTransaction
}) => {
  const { state, metrics, profileMode } = useFinancial();

  // Dynamic contextual hero insight based on real math
  const getContextualInsight = () => {
    if (metrics.todaysSpent > metrics.dailyAllowance && metrics.todaysSpent > 0) {
      return "You're spending slightly faster than your daily plan today. Easing off tomorrow protects your month-end surplus.";
    }
    if (metrics.unpaidReservedCommitments > 0) {
      return `₹${metrics.unpaidReservedCommitments} is reserved for upcoming bills. Your ₹${Math.round(metrics.dailyAllowance)}/day flexible budget is completely safe to spend.`;
    }
    return "You have zero pending bill obligations for the rest of this cycle! Great pacing.";
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Demo Profile Advisory Banner */}
      {profileMode === 'demo' && (
        <div className="p-3 rounded-xl bg-amber/10 border border-amber/25 text-amber text-xs flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber shrink-0" />
            <span>
              <strong>Demo Profile Active:</strong> Seeded with sample college transactions for hackathon demonstration. All metrics are calculated deterministically.
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber/15 uppercase font-semibold whitespace-nowrap">
            Sample Data
          </span>
        </div>
      )}

      {/* 1. Welcome Area & 30-Day Cycle Context */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-mint/10 via-cyan/5 to-transparent border border-mint/20 p-5 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-mint/20 text-mint font-semibold">
                Financial Cycle Active
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Day {state.cycle.currentDay} of 30
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                profileMode === 'demo' ? 'bg-amber/10 border-amber/30 text-amber' : 'bg-mint/10 border-mint/30 text-mint'
              }`}>
                {profileMode === 'demo' ? 'Seeded Demo Profile' : 'Clean Slate (Day 1)'}
              </span>
            </div>
            <h2 className="text-2xl font-heading font-extrabold text-white tracking-tight">
              Your money, in motion.
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {getContextualInsight()}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-mint text-black font-semibold text-xs hover:bg-mint/90 transition-all shadow-glow-mint"
            >
              <span>Test a Move</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Signature Visual Element: Interactive Money Orbit */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-mint" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Money Orbit Live Celestial Model
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Hover satellites to inspect cash flow orbits
          </span>
        </div>
        <MoneyOrbit onOpenSimulator={onOpenSimulator} />
      </div>

      {/* 3. Primary Metrics Triad */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <BalanceHeroCard onSimulate={onOpenSimulator} />
        <DailyAllowanceCard onSimulate={onOpenSimulator} />
        <HealthScoreCard onNavigateToHealth={() => onNavigate('health')} />
      </div>

      {/* 4. Commitments & Category Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <UpcomingCommitmentsWidget onNavigateToCommitments={() => onNavigate('commitments')} />
        </div>
        <div className="lg:col-span-7">
          <SpendingDonutChart onSelectCategory={() => onNavigate('budget')} />
        </div>
      </div>

      {/* 5. Savings Goals & Live Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <SavingsGoalsWidget onNavigateToGoals={() => onNavigate('goals')} />
        </div>
        <div className="lg:col-span-6">
          <MoneyInsightsWidget onAction={(target) => onNavigate(target as NavigationPage)} />
        </div>
      </div>

      {/* 6. Recent Activity Feed */}
      <div>
        <RecentActivityWidget onOpenAddModal={onOpenAddTransaction} />
      </div>
    </div>
  );
};
