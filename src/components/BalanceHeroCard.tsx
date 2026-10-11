import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Info, Lock, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { formatINR } from '../engine/currency';

export const BalanceHeroCard: React.FC<{ onSimulate?: () => void }> = ({ onSimulate }) => {
  const { metrics, state } = useFinancial();

  const pctConsumed = Math.min(100, Math.round((metrics.actualExpenses / metrics.startingFunds) * 100));
  const pctUncommitted = Math.max(0, Math.round((metrics.uncommittedCash / metrics.startingFunds) * 100));

  // Stroke calculation for circular progress ring (radius = 38)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pctConsumed / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1220] via-[#111827] to-[#0A0E17] border border-white/[0.08] p-6 shadow-glass">
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-mint/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-mint/10 border border-mint/20 text-mint">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Available Cash</span>
            <div className="text-[11px] text-slate-500 font-sans">Bank & in-hand balance</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 font-mono">
            Cycle Budget: {formatINR(metrics.startingFunds)}
          </span>
        </div>
      </div>

      {/* Main Balance Hero with Progress Ring */}
      <div className="mt-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-baseline gap-2">
            <motion.h1 
              key={metrics.availableCash}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-heading font-bold text-white tracking-tight tabular-nums"
            >
              {formatINR(metrics.availableCash)}
            </motion.h1>
            <span className="text-xs font-mono text-mint font-medium">INR</span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span>Spent so far: <strong className="text-slate-200 tabular-nums">{formatINR(metrics.actualExpenses)}</strong></span>
            <span>•</span>
            <span className="text-coral font-medium tabular-nums">{pctConsumed}% of ₹10k consumed</span>
          </div>
        </div>

        {/* Circular Progress Arc */}
        <div className="flex items-center gap-4 bg-background-card/60 p-3 rounded-xl border border-white/[0.05]">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-mint"
                strokeWidth="8"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-heading font-bold text-white tabular-nums">{pctConsumed}%</span>
              <span className="text-[9px] text-slate-400 uppercase">Spent</span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-mint" />
              <span>Free Cash: <strong className="text-white tabular-nums">{formatINR(metrics.uncommittedCash)}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-cyan" />
              <span>Bills Reserved: <span className="tabular-nums">{formatINR(metrics.unpaidReservedCommitments)}</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-lavender" />
              <span>Goals Locked: <span className="tabular-nums">{formatINR(metrics.unspentGoalAllocations)}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Uncommitted vs Available Cash Explanation Bar */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Lock className="w-3.5 h-3.5 text-amber" />
          <span>
            True flexible spend is <strong className="text-mint font-semibold tabular-nums">{formatINR(metrics.uncommittedCash)}</strong>.
            <span className="text-slate-400 ml-1 hidden sm:inline">(₹{metrics.unpaidReservedCommitments + metrics.unspentGoalAllocations} ring-fenced for bills & goals)</span>
          </span>
        </div>

        {onSimulate && (
          <button
            onClick={onSimulate}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-mint/10 hover:bg-mint/20 border border-mint/30 text-mint font-medium text-xs transition-colors"
          >
            <span>Simulate a Move</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
