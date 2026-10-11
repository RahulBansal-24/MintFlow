import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Tv, 
  Wifi, 
  Smartphone, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { formatINR } from '../engine/currency';
import { TransactionCategory, CommitmentStatus } from '../engine/types';

export const CommitmentsPage: React.FC = () => {
  const { state, metrics, payCommitment, cancelCommitment, addCommitment } = useFinancial();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [dueDay, setDueDay] = useState<number>(15);
  const [category, setCategory] = useState<TransactionCategory>('bills');
  const [isEssential, setIsEssential] = useState(true);
  const [isSubscription, setIsSubscription] = useState(false);

  // Subscription leakage calculation
  const discretionarySubs = state.commitments.filter(c => c.isSubscription && !c.isEssential && c.status === 'upcoming');
  const totalLeakage = discretionarySubs.reduce((sum, c) => sum + c.amount, 0);
  const potentialDailyBoost = Math.round(totalLeakage / metrics.remainingDays);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || Number(amount) <= 0) return;

    addCommitment({
      name,
      amount: Number(amount),
      category,
      dueDay,
      isEssential,
      status: 'upcoming',
      isSubscription,
      frequency: 'monthly'
    });

    setIsAdding(false);
    setName('');
    setAmount('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner & Subscription Leakage Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-r from-cyan/10 via-background-card to-background-card border border-cyan/20 shadow-glass space-y-2">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-cyan" />
            <h2 className="text-xl font-heading font-bold text-white">
              Commitments & Subscriptions
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Upcoming bills are reserved in advance so your daily allowance remains genuinely safe.
            When you mark a bill as paid, it converts into an actual expense without double-deduction.
          </p>
        </div>

        {/* Subscription Leakage Insight Card */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-background-card border border-white/[0.08] shadow-glass space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-amber font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber" />
              <span>Subscription Leakage Engine</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              {discretionarySubs.length} Active Subs
            </span>
          </div>

          <div className="text-xl font-heading font-bold text-white tabular-nums">
            {formatINR(totalLeakage)} <span className="text-xs font-normal text-slate-400">locked in wants</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Cancelling non-essential streaming plans frees an immediate <strong>+₹{potentialDailyBoost}/day</strong> in flexible daily cash.
          </p>
        </div>
      </div>

      {/* 2. Add Commitment Trigger */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider font-mono">
          Scheduled Obligations Timeline (Days 1–30)
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan text-black font-semibold text-xs hover:bg-cyan/90 transition-all shadow-glow-cyan"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Commitment</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="p-5 rounded-2xl bg-background-card border border-white/10 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Netflix, Gym Membership, Hostel Wi-Fi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background-elevated border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                min="1"
                placeholder="300"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-background-elevated border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Due Day (1-30)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={dueDay}
                onChange={(e) => setDueDay(Number(e.target.value))}
                className="w-full bg-background-elevated border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEssential(!isEssential)}
              className={`px-3 py-1.5 rounded-lg border font-medium ${
                isEssential ? 'bg-cyan/20 border-cyan text-cyan' : 'bg-background-elevated border-white/10 text-slate-400'
              }`}
            >
              {isEssential ? 'Essential Obligation' : 'Discretionary Subscription'}
            </button>

            <button
              type="button"
              onClick={() => setIsSubscription(!isSubscription)}
              className={`px-3 py-1.5 rounded-lg border font-medium ${
                isSubscription ? 'bg-lavender/20 border-lavender text-lavender' : 'bg-background-elevated border-white/10 text-slate-400'
              }`}
            >
              {isSubscription ? 'Recurring Subscription' : 'One-Time / Bill'}
            </button>

            <button
              type="submit"
              className="ml-auto px-4 py-1.5 rounded-lg bg-cyan text-black font-semibold text-xs shadow-glow-cyan"
            >
              Save Commitment
            </button>
          </div>
        </form>
      )}

      {/* 3. Commitments Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {state.commitments.map((comm) => {
          const isPaid = comm.status === 'paid';
          const isCancelled = comm.status === 'cancelled';
          const isDueSoon = comm.dueDay <= state.cycle.currentDay + 5 && comm.status === 'upcoming';

          return (
            <div
              key={comm.id}
              className={`p-5 rounded-2xl bg-gradient-to-br from-[#0D1220] to-[#111827] border ${
                isPaid ? 'border-mint/30 opacity-75' :
                isCancelled ? 'border-white/5 opacity-50' :
                isDueSoon ? 'border-amber/40 shadow-glow-amber' :
                'border-white/[0.08]'
              } shadow-glass flex flex-col justify-between gap-4`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                    comm.isEssential ? 'bg-cyan/15 text-cyan' : 'bg-lavender/15 text-lavender'
                  }`}>
                    {comm.isEssential ? 'Essential Need' : 'Discretionary'}
                  </span>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                    isPaid ? 'bg-mint/15 text-mint' :
                    isCancelled ? 'bg-slate-800 text-slate-400 line-through' :
                    'bg-white/[0.05] text-slate-300'
                  }`}>
                    {comm.status}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className={`text-base font-heading font-bold text-white ${isCancelled ? 'line-through text-slate-500' : ''}`}>
                    {comm.name}
                  </h4>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Due Day {comm.dueDay} of 30 {comm.dueDay >= state.cycle.currentDay ? `(in ${comm.dueDay - state.cycle.currentDay} days)` : '(Past due)'}
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-heading font-bold text-white tabular-nums">
                    {formatINR(comm.amount)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    /{comm.frequency}
                  </span>
                </div>

                {comm.notes && (
                  <p className="mt-2 text-[11px] text-slate-400 italic">
                    "{comm.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                {!isPaid && !isCancelled && (
                  <>
                    <button
                      type="button"
                      onClick={() => payCommitment(comm.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-mint/15 hover:bg-mint text-mint hover:text-black font-semibold text-xs border border-mint/30 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Paid</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cancelCommitment(comm.id)}
                      className="px-3 py-2 rounded-xl bg-coral/10 hover:bg-coral/25 text-coral text-xs border border-coral/20 transition-colors"
                      title="Cancel Subscription"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {isPaid && (
                  <span className="text-xs text-mint flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Settled into actual expenses</span>
                  </span>
                )}

                {isCancelled && (
                  <span className="text-xs text-slate-500 font-mono">
                    Subscription cancelled
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
