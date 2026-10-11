import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  X, 
  Sliders, 
  Check, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinancial } from '../context/FinancialContext';
import { 
  DecisionType, 
  SimulationDecision, 
  TransactionCategory, 
  SimulationResult,
  SmartAlternative 
} from '../engine/types';
import { simulateDecision } from '../engine/scenarioEngine';
import { formatINR } from '../engine/currency';

interface SpendSimulatorViewProps {
  initialDecision?: Partial<SimulationDecision>;
  onClose?: () => void;
  isModal?: boolean;
}

const PRESET_AMOUNTS = [100, 250, 500, 1000, 2000, 3500];

export const SpendSimulatorView: React.FC<SpendSimulatorViewProps> = ({ 
  initialDecision, 
  onClose,
  isModal = false 
}) => {
  const { state, commitSimulation } = useFinancial();

  // Builder State
  const [decisionType, setDecisionType] = useState<DecisionType>(initialDecision?.type || 'buy_now');
  const [amount, setAmount] = useState<number>(initialDecision?.amount !== undefined ? initialDecision.amount : 1500);
  const [title, setTitle] = useState<string>(initialDecision?.title || 'AirPods / Noise Cancelling Earbuds');
  const [category, setCategory] = useState<TransactionCategory>(initialDecision?.category || 'shopping');
  const [isEssential, setIsEssential] = useState<boolean>(initialDecision?.isEssential || false);
  const [targetGoalId, setTargetGoalId] = useState<string>(initialDecision?.targetGoalId || state.goals[0]?.id || '');
  const [targetCommitmentId, setTargetCommitmentId] = useState<string>(
    initialDecision?.targetCommitmentId || state.commitments[0]?.id || ''
  );
  const [committedSuccess, setCommittedSuccess] = useState<boolean>(false);

  // Compute live isolated simulation
  const currentDecision: SimulationDecision = useMemo(() => ({
    type: decisionType,
    amount: Math.max(0, amount),
    title,
    category,
    isEssential,
    targetGoalId,
    targetCommitmentId,
    day: state.cycle.currentDay
  }), [decisionType, amount, title, category, isEssential, targetGoalId, targetCommitmentId, state.cycle.currentDay]);

  const simResult: SimulationResult = useMemo(() => {
    return simulateDecision(state, currentDecision);
  }, [state, currentDecision]);

  // Handle alternative pick
  const applyAlternative = (alt: SmartAlternative) => {
    if (alt.actionType === 'reduce') {
      setAmount(alt.adjustedAmount);
      setTitle(alt.title);
    } else if (alt.actionType === 'cancel_sub' && alt.targetCommitmentId) {
      setDecisionType('cancel_subscription');
      setTargetCommitmentId(alt.targetCommitmentId);
    }
  };

  // Commit decision to true application state
  const handleCommit = () => {
    commitSimulation(currentDecision);
    setCommittedSuccess(true);
    
    // Trigger celebratory confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    setTimeout(() => {
      setCommittedSuccess(false);
      if (onClose) onClose();
    }, 1600);
  };

  const handleReset = () => {
    setAmount(1000);
    setTitle('Spontaneous Purchase');
    setCategory('shopping');
    setIsEssential(false);
    setDecisionType('buy_now');
  };

  return (
    <div className={`relative ${isModal ? 'max-w-5xl mx-auto' : 'w-full'} select-none`}>
      {/* Title & Gen Z Tagline */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-mint/10 border border-mint/20 text-mint">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-heading font-bold text-white">Spend Simulator & Decision Lab</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            "Every financial decision has a consequence. Preview it in real time before spending a single rupee."
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Split-Screen Decision Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Decision Builder (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] space-y-4">
            {/* 1. Decision Type Selector */}
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 mb-1.5 block">
                Decision Type
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => { setDecisionType('buy_now'); setTitle('Spontaneous Buy'); setIsEssential(false); }}
                  className={`px-3 py-2 rounded-lg border text-left transition-all ${
                    decisionType === 'buy_now' 
                      ? 'bg-mint/15 border-mint text-white font-medium shadow-glow-mint' 
                      : 'bg-background-elevated/50 border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  💳 Buy Something Now
                </button>

                <button
                  type="button"
                  onClick={() => { setDecisionType('emergency'); setTitle('Emergency Repair'); setIsEssential(true); }}
                  className={`px-3 py-2 rounded-lg border text-left transition-all ${
                    decisionType === 'emergency' 
                      ? 'bg-coral/15 border-coral text-white font-medium shadow-glow-coral' 
                      : 'bg-background-elevated/50 border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  🚨 Emergency Expense
                </button>

                <button
                  type="button"
                  onClick={() => { setDecisionType('save_goal'); setTitle('Goal Deposit'); setIsEssential(true); }}
                  className={`px-3 py-2 rounded-lg border text-left transition-all ${
                    decisionType === 'save_goal' 
                      ? 'bg-lavender/15 border-lavender text-white font-medium shadow-glow-lavender' 
                      : 'bg-background-elevated/50 border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  🎯 Save for Goal
                </button>

                <button
                  type="button"
                  onClick={() => { setDecisionType('cancel_subscription'); setTitle('Cut Subscription'); }}
                  className={`px-3 py-2 rounded-lg border text-left transition-all ${
                    decisionType === 'cancel_subscription' 
                      ? 'bg-cyan/15 border-cyan text-white font-medium shadow-glow-cyan' 
                      : 'bg-background-elevated/50 border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  ✂️ Cancel Subscription
                </button>

                <button
                  type="button"
                  onClick={() => { setDecisionType('pay_bill'); setTitle('Pay Scheduled Bill'); setIsEssential(true); }}
                  className={`px-3 py-2 rounded-lg border text-left transition-all ${
                    decisionType === 'pay_bill' 
                      ? 'bg-amber/15 border-amber text-white font-medium' 
                      : 'bg-background-elevated/50 border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  ⚡ Pay Upcoming Bill
                </button>

                <button
                  type="button"
                  onClick={() => { setDecisionType('add_income'); setTitle('Side Hustle Gig'); setIsEssential(false); }}
                  className={`px-3 py-2 rounded-lg border text-left transition-all ${
                    decisionType === 'add_income' 
                      ? 'bg-mint/15 border-mint text-white font-medium' 
                      : 'bg-background-elevated/50 border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  💰 Receive Extra Income
                </button>
              </div>
            </div>

            {/* Target Selectors for Goals or Subscriptions */}
            {decisionType === 'save_goal' && (
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 mb-1 block">Target Savings Goal</label>
                <select
                  value={targetGoalId}
                  onChange={(e) => setTargetGoalId(e.target.value)}
                  className="w-full bg-background-elevated border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-mint focus:outline-none"
                >
                  {state.goals.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({formatINR(g.savedAmount)} / {formatINR(g.targetAmount)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(decisionType === 'cancel_subscription' || decisionType === 'pay_bill') && (
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 mb-1 block">Select Obligation</label>
                <select
                  value={targetCommitmentId}
                  onChange={(e) => {
                    setTargetCommitmentId(e.target.value);
                    const selected = state.commitments.find(c => c.id === e.target.value);
                    if (selected) setAmount(selected.amount);
                  }}
                  className="w-full bg-background-elevated border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-mint focus:outline-none"
                >
                  {state.commitments.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {formatINR(c.amount)} ({c.status})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 2. Interactive Amount Slider & Presets */}
            {decisionType !== 'cancel_subscription' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono uppercase text-slate-400">Decision Amount</label>
                  <span className="text-xl font-heading font-bold text-mint tabular-nums">
                    {formatINR(amount)}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-mint"
                />

                {/* Presets */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {PRESET_AMOUNTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAmount(p)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                        amount === p 
                          ? 'bg-mint text-black font-bold border-mint' 
                          : 'bg-white/[0.04] text-slate-300 border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      ₹{p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Description & Category */}
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 mb-1 block">Description</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What is this move for?"
                className="w-full bg-background-elevated border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-mint focus:outline-none placeholder-slate-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 mb-1 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                  className="w-full bg-background-elevated border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-mint focus:outline-none capitalize"
                >
                  <option value="food">Food & Dining</option>
                  <option value="transport">Transport</option>
                  <option value="shopping">Shopping</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="education">Education</option>
                  <option value="bills">Bills & Utilities</option>
                  <option value="health">Health & Emergency</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 mb-1 block">Necessity</label>
                <button
                  type="button"
                  onClick={() => setIsEssential(!isEssential)}
                  className={`w-full py-1.5 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    isEssential 
                      ? 'bg-cyan/15 border-cyan text-cyan' 
                      : 'bg-background-elevated border-white/10 text-slate-300'
                  }`}
                >
                  {isEssential ? 'Essential Need' : 'Discretionary / Want'}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <button 
                type="button"
                onClick={handleReset}
                className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset inputs</span>
              </button>

              <span className="text-[10px] text-slate-500 font-mono">Isolated Simulation</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live Consequences & Impact (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Decision Verdict Banner */}
          <div className={`p-4 rounded-2xl border transition-all ${
            simResult.verdict.tone === 'danger'
              ? 'bg-coral/10 border-coral/40 shadow-glow-coral'
              : simResult.verdict.tone === 'caution'
              ? 'bg-amber/10 border-amber/40 shadow-glow-amber'
              : simResult.verdict.tone === 'positive'
              ? 'bg-mint/10 border-mint/40 shadow-glow-mint'
              : 'bg-cyan/10 border-cyan/40 shadow-glow-cyan'
          }`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {simResult.verdict.tone === 'danger' ? (
                  <AlertTriangle className="w-5 h-5 text-coral" />
                ) : simResult.verdict.tone === 'caution' ? (
                  <AlertTriangle className="w-5 h-5 text-amber" />
                ) : (
                  <Sparkles className="w-5 h-5 text-mint" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-heading font-bold text-white">
                  {simResult.verdict.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {simResult.verdict.explanation}
                </p>
              </div>
            </div>
          </div>

          {/* Before vs After Impact Grid */}
          <div className="glass-panel p-4 rounded-2xl border border-white/[0.08] space-y-3">
            <div className="text-[11px] font-mono uppercase text-slate-400">
              Before vs. After Consequence Matrix
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Metric 1: Available Cash */}
              <div className="bg-background-elevated/60 p-3 rounded-xl border border-white/[0.04]">
                <div className="text-[10px] text-slate-400 font-mono">Available Cash</div>
                <div className="mt-1 flex items-baseline gap-1 text-xs font-mono text-slate-400 line-through">
                  {formatINR(simResult.before.availableCash)}
                </div>
                <div className="text-base font-heading font-bold text-white tabular-nums">
                  {formatINR(simResult.after.availableCash)}
                </div>
                <div className={`text-[10px] font-mono mt-0.5 ${
                  simResult.deltaAvailableCash < 0 ? 'text-coral' : simResult.deltaAvailableCash > 0 ? 'text-mint' : 'text-slate-400'
                }`}>
                  {simResult.deltaAvailableCash > 0 ? '+' : ''}{formatINR(simResult.deltaAvailableCash)}
                </div>
              </div>

              {/* Metric 2: Daily Allowance */}
              <div className="bg-background-elevated/60 p-3 rounded-xl border border-white/[0.04]">
                <div className="text-[10px] text-slate-400 font-mono">Daily Allowance</div>
                <div className="mt-1 flex items-baseline gap-1 text-xs font-mono text-slate-400 line-through">
                  ₹{Math.round(simResult.before.dailyAllowance)}/d
                </div>
                <div className="text-base font-heading font-bold text-mint tabular-nums">
                  ₹{Math.round(simResult.after.dailyAllowance)}/d
                </div>
                <div className={`text-[10px] font-mono mt-0.5 ${
                  simResult.deltaDailyAllowance < 0 ? 'text-coral' : simResult.deltaDailyAllowance > 0 ? 'text-mint' : 'text-slate-400'
                }`}>
                  {simResult.deltaDailyAllowance >= 0 ? '+' : ''}₹{Math.round(simResult.deltaDailyAllowance)}/d
                </div>
              </div>

              {/* Metric 3: Month-End Balance */}
              <div className="bg-background-elevated/60 p-3 rounded-xl border border-white/[0.04]">
                <div className="text-[10px] text-slate-400 font-mono">Day 30 Forecast</div>
                <div className="mt-1 flex items-baseline gap-1 text-xs font-mono text-slate-400 line-through">
                  {formatINR(simResult.before.projectedMonthEndBalance)}
                </div>
                <div className={`text-base font-heading font-bold tabular-nums ${
                  simResult.after.projectedMonthEndBalance < 0 ? 'text-coral' : 'text-cyan'
                }`}>
                  {formatINR(simResult.after.projectedMonthEndBalance)}
                </div>
                <div className={`text-[10px] font-mono mt-0.5 ${
                  simResult.deltaProjectedBalance < 0 ? 'text-coral' : 'text-mint'
                }`}>
                  {simResult.deltaProjectedBalance >= 0 ? '+' : ''}{formatINR(simResult.deltaProjectedBalance)}
                </div>
              </div>

              {/* Metric 4: Health Score */}
              <div className="bg-background-elevated/60 p-3 rounded-xl border border-white/[0.04]">
                <div className="text-[10px] text-slate-400 font-mono">Health Score</div>
                <div className="mt-1 flex items-baseline gap-1 text-xs font-mono text-slate-400 line-through">
                  {simResult.before.healthScore} pts
                </div>
                <div className="text-base font-heading font-bold text-lavender tabular-nums">
                  {simResult.after.healthScore} pts
                </div>
                <div className={`text-[10px] font-mono mt-0.5 ${
                  simResult.deltaHealthScore < 0 ? 'text-coral' : 'text-mint'
                }`}>
                  {simResult.deltaHealthScore >= 0 ? '+' : ''}{simResult.deltaHealthScore} pts
                </div>
              </div>
            </div>

            {/* Consequence Timeline */}
            <div className="pt-2 border-t border-white/[0.06] space-y-2">
              <div className="text-[11px] font-mono uppercase text-slate-400">Timeline Impact Projection</div>
              <div className="space-y-1.5">
                {simResult.consequenceTimeline.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-background-elevated/40 border border-white/[0.03]">
                    <span className="font-medium text-slate-300">{item.timeframe}:</span>
                    <span className={`text-[11px] ${
                      item.severity === 'danger' ? 'text-coral font-medium' :
                      item.severity === 'caution' ? 'text-amber' :
                      item.severity === 'positive' ? 'text-mint' : 'text-slate-400'
                    }`}>
                      {item.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Smart Alternatives */}
          {simResult.smartAlternatives.length > 0 && (
            <div className="p-4 rounded-2xl bg-background-card border border-white/[0.06] space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-lavender font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Alternatives to Protect Your Runway</span>
              </div>

              <div className="space-y-2">
                {simResult.smartAlternatives.map((alt) => (
                  <div 
                    key={alt.id}
                    className="p-2.5 rounded-xl bg-background-elevated/70 border border-white/[0.05] hover:border-lavender/30 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div>
                      <div className="font-medium text-white">{alt.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{alt.description}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => applyAlternative(alt)}
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-lavender/10 hover:bg-lavender/25 text-lavender border border-lavender/20 text-xs font-medium transition-colors"
                    >
                      Try This
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Confirmation Bar */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose || handleReset}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.04] text-xs font-medium transition-colors"
            >
              Keep Exploring (Discard)
            </button>

            <button
              type="button"
              disabled={committedSuccess}
              onClick={handleCommit}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-mint hover:bg-mint/90 text-black font-semibold text-xs shadow-glow-mint transition-all transform active:scale-95 disabled:opacity-50"
            >
              {committedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Decision Saved to State!</span>
                </>
              ) : (
                <>
                  <span>Confirm Decision</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
