import React, { useState } from 'react';
import { Target, Plus, Shield, Headphones, Mountain, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinancial } from '../context/FinancialContext';
import { formatINR } from '../engine/currency';

export const SavingsGoalsWidget: React.FC<{ onNavigateToGoals?: () => void }> = ({ onNavigateToGoals }) => {
  const { state, metrics, contributeToGoal } = useFinancial();
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'shield': return <Shield className="w-4 h-4 text-mint" />;
      case 'headphones': return <Headphones className="w-4 h-4 text-cyan" />;
      case 'mountain': return <Mountain className="w-4 h-4 text-lavender" />;
      default: return <Target className="w-4 h-4 text-mint" />;
    }
  };

  const handleQuickAdd = (goalId: string, amount: number) => {
    contributeToGoal(goalId, amount);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1220] to-[#111827] border border-white/[0.08] p-5 shadow-glass flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-lavender/10 border border-lavender/20 text-lavender">
              <Target className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">Savings Goals</span>
          </div>
          <span className="text-xs font-mono text-lavender">
            Total Saved: {formatINR(metrics.unspentGoalAllocations)}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {state.goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
            const isCompleted = pct >= 100;

            return (
              <div 
                key={goal.id}
                className="p-3 rounded-xl bg-background-elevated/50 border border-white/[0.04] space-y-2 hover:border-white/[0.1] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.05]">
                      {getIcon(goal.icon)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{goal.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Target: Day {goal.targetDay} • {formatINR(goal.targetAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-heading font-bold text-mint tabular-nums">
                      {formatINR(goal.savedAmount)}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{pct}% funded</span>
                  </div>
                </div>

                {/* Progress bar with milestone notches */}
                <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-mint to-cyan"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Quick Add buttons */}
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="text-slate-400">
                    Needs ~₹{Math.round((goal.targetAmount - goal.savedAmount) / metrics.remainingDays)}/day
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(goal.id, 100)}
                      className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-mint/20 hover:text-mint border border-white/[0.08] text-slate-300 font-mono transition-colors"
                    >
                      +₹100
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(goal.id, 250)}
                      className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-mint/20 hover:text-mint border border-white/[0.08] text-slate-300 font-mono transition-colors"
                    >
                      +₹250
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400">
          Saved money is ring-fenced from daily spend
        </span>

        {onNavigateToGoals && (
          <button
            onClick={onNavigateToGoals}
            className="text-xs text-lavender hover:text-white flex items-center gap-1 font-medium transition-colors"
          >
            <span>Goal Roadmaps →</span>
          </button>
        )}
      </div>
    </div>
  );
};
