import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Calendar, TrendingDown, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { formatINR } from '../engine/currency';

export const DailyAllowanceCard: React.FC<{ onSimulate?: () => void }> = ({ onSimulate }) => {
  const { metrics, state } = useFinancial();

  // Mini 7-day spending history for sparkline
  const days = [1, 2, 3, 4, 5, 6, 7];
  const spendByDay = days.map(d => {
    const txs = state.transactions.filter(t => t.day === d && t.type === 'expense');
    return txs.reduce((sum, t) => sum + t.amount, 0);
  });
  const maxSpend = Math.max(...spendByDay, 1);

  const isOverPace = metrics.todaysSpent > metrics.dailyAllowance;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1220] to-[#111827] border border-white/[0.08] p-6 shadow-glass flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan/10 border border-cyan/20 text-cyan">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">Daily Safe Allowance</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] text-[11px] font-mono text-slate-400">
            <Calendar className="w-3 h-3 text-cyan" />
            <span>{metrics.remainingDays} Days Left</span>
          </div>
        </div>

        {/* Main Numeric Display */}
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <motion.h2 
              key={metrics.dailyAllowance}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl sm:text-4xl font-heading font-bold text-mint tracking-tight tabular-nums"
            >
              ₹{Math.round(metrics.dailyAllowance)}
            </motion.h2>
            <span className="text-xs text-slate-400 font-sans">/ day spendable</span>
          </div>

          <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
            <span>Today's Spend: <strong className="text-white tabular-nums">{formatINR(metrics.todaysSpent)}</strong></span>
            <span>•</span>
            <span className={isOverPace ? 'text-coral font-medium' : 'text-mint font-medium'}>
              {isOverPace ? 'Over pace today' : 'Well within pace'}
            </span>
          </div>
        </div>

        {/* 7-Day Mini Bar Sparkline */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-mono mb-1.5">
            <span>7-Day Past Velocity</span>
            <span>Avg ₹{Math.round(metrics.averageDailySpent)}/d</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 h-12 items-end bg-background-elevated/40 p-2 rounded-lg border border-white/[0.03]">
            {spendByDay.map((val, idx) => {
              const heightPct = Math.max(12, Math.round((val / maxSpend) * 100));
              const isPastHigh = val > metrics.dailyAllowance;
              return (
                <div key={idx} className="group relative flex flex-col items-center h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-7 z-20 pointer-events-none px-1.5 py-0.5 rounded bg-black text-[9px] font-mono text-white whitespace-nowrap transition-opacity">
                    Day {idx + 1}: ₹{val}
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-sm transition-all ${
                      isPastHigh ? 'bg-amber/70 group-hover:bg-amber' : 'bg-mint/40 group-hover:bg-mint'
                    }`}
                  />
                  <span className="text-[8px] text-slate-500 mt-1 font-mono">D{idx + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Or <strong className="text-slate-300">₹{Math.round(metrics.dailyAllowanceWithGoals)}/d</strong> if pausing goals
        </span>

        {onSimulate && (
          <button
            onClick={onSimulate}
            className="text-xs text-mint hover:text-white flex items-center gap-1 font-medium transition-colors"
          >
            <span>Simulate Impact →</span>
          </button>
        )}
      </div>
    </div>
  );
};
