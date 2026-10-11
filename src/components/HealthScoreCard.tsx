import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertCircle, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const HealthScoreCard: React.FC<{ onNavigateToHealth?: () => void }> = ({ onNavigateToHealth }) => {
  const { metrics } = useFinancial();
  const { score, level, topContributors, primaryRecommendation } = metrics.riskAssessment;

  const prevScore = metrics.previousHealthScore || 78;
  const delta = score - prevScore;

  // Visual styling mapped to risk level
  const levelStyles = {
    Stable: {
      badgeBg: 'bg-mint/10 border-mint/30 text-mint',
      strokeColor: '#65F5B4',
      label: 'Stable & In Control',
      glow: 'shadow-glow-mint'
    },
    Watchful: {
      badgeBg: 'bg-cyan/10 border-cyan/30 text-cyan',
      strokeColor: '#55DDF5',
      label: 'Watchful Pace',
      glow: 'shadow-glow-cyan'
    },
    Elevated: {
      badgeBg: 'bg-amber/10 border-amber/30 text-amber',
      strokeColor: '#FFC66D',
      label: 'Elevated Risk',
      glow: 'shadow-glow-amber'
    },
    Critical: {
      badgeBg: 'bg-coral/10 border-coral/30 text-coral',
      strokeColor: '#FF777D',
      label: 'Critical Alert',
      glow: 'shadow-glow-coral'
    }
  }[level];

  // Circle stroke
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1220] to-[#111827] border border-white/[0.08] p-6 shadow-glass flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-lavender/10 border border-lavender/20 text-lavender">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">Financial Health Index</span>
          </div>

          <div className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium font-sans ${levelStyles.badgeBg}`}>
            {levelStyles.label}
          </div>
        </div>

        {/* Score Radial & Delta */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="6"
                  fill="none"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke={levelStyles.strokeColor}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-heading font-bold text-white tabular-nums">{score}</span>
                <span className="text-[9px] text-slate-400 font-mono">/ 100</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400">Pacing & Runway Score</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs">
                {delta >= 0 ? (
                  <span className="text-mint font-medium font-mono">+{delta} pts</span>
                ) : (
                  <span className="text-coral font-medium font-mono">{delta} pts</span>
                )}
                <span className="text-slate-500">vs saved snapshot</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Runway: <strong className="text-slate-200">{metrics.riskAssessment.runwayDays} days</strong> of cash
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Factors */}
        <div className="mt-4 space-y-1.5 bg-background-elevated/40 p-3 rounded-xl border border-white/[0.04]">
          <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">Key Factors Shaping Score</div>
          {topContributors.map((item, idx) => (
            <div key={idx} className="text-xs text-slate-300 flex items-center gap-1.5 leading-snug">
              <span className="text-[11px]">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation and Link */}
      <div className="mt-4 pt-3 border-t border-white/[0.06]">
        <div className="text-[11px] text-slate-300 bg-mint/5 border border-mint/15 rounded-lg p-2.5">
          <strong className="text-mint block mb-0.5">Top Recommendation:</strong>
          {primaryRecommendation}
        </div>

        {onNavigateToHealth && (
          <button
            onClick={onNavigateToHealth}
            className="mt-3 w-full text-center text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
          >
            <span>Inspect Health & Scenario Models</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
