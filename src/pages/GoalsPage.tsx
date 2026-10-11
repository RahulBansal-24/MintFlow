import React, { useState } from 'react';
import { Target, Plus, Shield, Headphones, Mountain, Sparkles, Check, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinancial } from '../context/FinancialContext';
import { formatINR } from '../engine/currency';

export const GoalsPage: React.FC = () => {
  const { state, metrics, addGoal, contributeToGoal, withdrawFromGoal, deleteGoal } = useFinancial();
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState<number | ''>('');
  const [newDay, setNewDay] = useState<number>(30);
  const [newIcon, setNewIcon] = useState('headphones');

  // Contribution state
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [transferAmount, setTransferAmount] = useState<number>(200);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newTarget || Number(newTarget) <= 0) return;

    addGoal({
      name: newName,
      targetAmount: Number(newTarget),
      targetDay: newDay,
      icon: newIcon,
      status: 'active'
    });

    setIsCreating(false);
    setNewName('');
    setNewTarget('');
  };

  const handleContribute = (goalId: string, amount: number) => {
    if (amount <= 0) return;
    contributeToGoal(goalId, amount);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
    setSelectedGoalId(null);
  };

  const handleWithdraw = (goalId: string, amount: number) => {
    if (amount <= 0) return;
    withdrawFromGoal(goalId, amount);
    setSelectedGoalId(null);
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'shield': return <Shield className="w-5 h-5 text-mint" />;
      case 'headphones': return <Headphones className="w-5 h-5 text-cyan" />;
      case 'mountain': return <Mountain className="w-5 h-5 text-lavender" />;
      default: return <Target className="w-5 h-5 text-mint" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-lavender/10 via-background-card to-background-card border border-lavender/20 shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-lavender" />
            <h2 className="text-xl font-heading font-bold text-white">
              Savings Goals & Milestones
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Ring-fenced allocations for future dreams. Savings transfers protect your cash from impulsive daily spending without counting as consumption debt.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-lavender text-black font-semibold text-xs hover:bg-lavender/90 transition-all shadow-glow-lavender"
        >
          <Plus className="w-4 h-4" />
          <span>New Savings Target</span>
        </button>
      </div>

      {/* Create New Goal Inline Card */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-5 rounded-2xl bg-background-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-heading font-bold text-white">Create New Goal</h3>
            <button type="button" onClick={() => setIsCreating(false)} className="text-xs text-slate-400 hover:text-white">Cancel</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Goal Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sony WH-1000XM5, Goa Trip, Emergency Reserve"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-background-elevated border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-lavender"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Target (₹)</label>
              <input
                type="number"
                required
                min="100"
                placeholder="2500"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-background-elevated border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-lavender"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Target Day (1-30)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={newDay}
                onChange={(e) => setNewDay(Number(e.target.value))}
                className="w-full bg-background-elevated border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-lavender"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-lavender text-black font-semibold text-xs shadow-glow-lavender"
            >
              Save Goal
            </button>
          </div>
        </form>
      )}

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {state.goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
          const dailyRequired = Math.round(remaining / metrics.remainingDays);

          return (
            <div
              key={goal.id}
              className="p-5 rounded-2xl bg-gradient-to-br from-[#0D1220] to-[#111827] border border-white/[0.08] shadow-glass flex flex-col justify-between gap-4 group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-xl bg-background-elevated border border-white/10">
                    {getIcon(goal.icon)}
                  </div>

                  <button
                    type="button"
                    title="Delete Goal"
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1 rounded text-slate-600 hover:text-coral opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-heading font-bold text-white">{goal.name}</h3>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Target: Day {goal.targetDay} • {formatINR(goal.targetAmount)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-heading font-bold text-mint tabular-nums">
                      {formatINR(goal.savedAmount)}
                    </span>
                    <span className="font-mono text-slate-400">{pct}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-mint via-cyan to-lavender rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Milestone Markers */}
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-0.5">
                    <span className={pct >= 25 ? 'text-mint font-semibold' : ''}>25%</span>
                    <span className={pct >= 50 ? 'text-mint font-semibold' : ''}>50%</span>
                    <span className={pct >= 75 ? 'text-mint font-semibold' : ''}>75%</span>
                    <span className={pct >= 100 ? 'text-mint font-semibold' : ''}>100%</span>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-background-elevated/40 border border-white/[0.04] text-[11px] text-slate-300">
                  <span>Pacing: </span>
                  <strong className="text-white">₹{dailyRequired}/day</strong> needed over {metrics.remainingDays} remaining days.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleContribute(goal.id, 250)}
                  className="flex-1 py-2 rounded-xl bg-mint/15 hover:bg-mint text-mint hover:text-black font-semibold text-xs border border-mint/30 transition-all text-center"
                >
                  +₹250 Add
                </button>

                <button
                  type="button"
                  onClick={() => handleWithdraw(goal.id, 200)}
                  disabled={goal.savedAmount <= 0}
                  className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 text-xs border border-white/10 transition-colors disabled:opacity-30"
                >
                  Withdraw
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
