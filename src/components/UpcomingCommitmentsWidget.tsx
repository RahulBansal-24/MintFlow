import React from 'react';
import { Calendar, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { formatINR } from '../engine/currency';

export const UpcomingCommitmentsWidget: React.FC<{ onNavigateToCommitments?: () => void }> = ({ 
  onNavigateToCommitments 
}) => {
  const { state, metrics, payCommitment, cancelCommitment } = useFinancial();

  const upcomingCommitments = state.commitments
    .filter(c => c.status === 'upcoming')
    .sort((a, b) => a.dueDay - b.dueDay);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1220] to-[#111827] border border-white/[0.08] p-5 shadow-glass flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan/10 border border-cyan/20 text-cyan">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">Upcoming Commitments</span>
          </div>
          <span className="text-xs font-mono text-cyan">
            Reserved: {formatINR(metrics.unpaidReservedCommitments)}
          </span>
        </div>

        {/* List of commitments */}
        <div className="mt-4 space-y-2.5">
          {upcomingCommitments.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              No upcoming commitments for this cycle! All clear.
            </div>
          ) : (
            upcomingCommitments.map((comm) => (
              <div 
                key={comm.id}
                className="p-3 rounded-xl bg-background-elevated/50 border border-white/[0.04] hover:border-white/[0.1] flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white">{comm.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      comm.isEssential ? 'bg-cyan/15 text-cyan' : 'bg-lavender/15 text-lavender'
                    }`}>
                      {comm.isEssential ? 'Essential' : 'Sub'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Due Day {comm.dueDay} • {comm.dueDay - state.cycle.currentDay > 0 ? `in ${comm.dueDay - state.cycle.currentDay} days` : 'Due Today!'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-heading font-bold text-white tabular-nums">
                      {formatINR(comm.amount)}
                    </div>
                  </div>

                  {/* Actions: Mark Paid or Cancel */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Mark as Paid"
                      onClick={() => payCommitment(comm.id)}
                      className="p-1.5 rounded-lg bg-mint/10 hover:bg-mint/25 text-mint border border-mint/20 text-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    {comm.isSubscription && (
                      <button
                        type="button"
                        title="Cancel Subscription"
                        onClick={() => cancelCommitment(comm.id)}
                        className="p-1.5 rounded-lg bg-coral/10 hover:bg-coral/25 text-coral border border-coral/20 text-xs transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400">
          Reserved money is protected from accidental spend
        </span>

        {onNavigateToCommitments && (
          <button
            onClick={onNavigateToCommitments}
            className="text-xs text-cyan hover:text-white flex items-center gap-1 font-medium transition-colors"
          >
            <span>Manage All ({state.commitments.length}) →</span>
          </button>
        )}
      </div>
    </div>
  );
};
