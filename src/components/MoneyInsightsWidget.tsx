import React from 'react';
import { Sparkles, ArrowRight, AlertTriangle, Lightbulb, CheckCircle2, TrendingUp } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { MoneyInsight } from '../engine/insightsEngine';

interface MoneyInsightsWidgetProps {
  onAction?: (target: MoneyInsight['actionTarget']) => void;
}

export const MoneyInsightsWidget: React.FC<MoneyInsightsWidgetProps> = ({ onAction }) => {
  const { insights } = useFinancial();

  const getInsightIcon = (type: MoneyInsight['type']) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4 text-coral" />;
      case 'tip': return <Lightbulb className="w-4 h-4 text-amber" />;
      case 'celebration': return <CheckCircle2 className="w-4 h-4 text-mint" />;
      case 'optimization': return <Sparkles className="w-4 h-4 text-cyan" />;
    }
  };

  const getBorderColor = (type: MoneyInsight['type']) => {
    switch (type) {
      case 'alert': return 'border-coral/20 hover:border-coral/40';
      case 'tip': return 'border-amber/20 hover:border-amber/40';
      case 'celebration': return 'border-mint/20 hover:border-mint/40';
      case 'optimization': return 'border-cyan/20 hover:border-cyan/40';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1220] to-[#111827] border border-white/[0.08] p-5 shadow-glass">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-mint/10 border border-mint/20 text-mint">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">Live Money Insights</span>
            <div className="text-[11px] text-slate-500 font-sans">Deterministic pattern analysis from your records</div>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400">
          {insights.length} Signals
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className={`p-3.5 rounded-xl bg-background-elevated/60 border ${getBorderColor(ins.type)} flex flex-col justify-between gap-3 transition-colors`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  {getInsightIcon(ins.type)}
                  <span className="text-xs font-heading font-semibold text-white">{ins.title}</span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-400 whitespace-nowrap">
                  {ins.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {ins.description}
              </p>
            </div>

            {onAction && (
              <button
                type="button"
                onClick={() => onAction(ins.actionTarget)}
                className="self-start text-[11px] font-medium text-mint hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>{ins.actionText}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
