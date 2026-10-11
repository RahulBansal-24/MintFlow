import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  ShoppingBag, 
  AlertTriangle, 
  Tv, 
  ArrowRight, 
  RotateCcw,
  PiggyBank,
  CalendarClock
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { SimulationDecision } from '../engine/types';
import { formatINR } from '../engine/currency';

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchScenario: (decision: Partial<SimulationDecision>) => void;
}

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({
  isOpen,
  onClose,
  onLaunchScenario
}) => {
  const { resetDemo, state, metrics } = useFinancial();

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'scen-impulse',
      badge: 'Scenario 1: Impulse Buy',
      title: 'The ₹1,500 Sneaker / Earbuds Temptation',
      description: `Spotting a flash sale: see how spending ₹1,500 instantly drops your flexible allowance from ₹${Math.round(metrics.dailyAllowance)}/d to ₹${Math.max(0, Math.round((metrics.uncommittedCash - 1500) / (metrics.remainingDays || 1)))}/d and compare cheaper value editions.`,
      icon: <ShoppingBag className="w-5 h-5 text-amber" />,
      borderColor: 'border-amber/30 hover:border-amber',
      tagColor: 'bg-amber/15 text-amber',
      actionDecision: {
        type: 'buy_now' as const,
        amount: 1500,
        title: 'Impulse Buy: Wireless Earbuds Flash Sale',
        category: 'shopping' as const,
        isEssential: false
      }
    },
    {
      id: 'scen-emergency',
      badge: 'Scenario 2: The Emergency',
      title: 'Unexpected ₹2,000 Laptop Screen Repair',
      description: 'Your laptop display cracks right before semester submissions. Stress-test whether available cash covers both the emergency and upcoming hostel bills, and inspect recovery options.',
      icon: <AlertTriangle className="w-5 h-5 text-coral" />,
      borderColor: 'border-coral/30 hover:border-coral',
      tagColor: 'bg-coral/15 text-coral',
      actionDecision: {
        type: 'emergency' as const,
        amount: 2000,
        title: 'Emergency: Laptop Screen Display Fix',
        category: 'bills' as const,
        isEssential: true
      }
    },
    {
      id: 'scen-subscription',
      badge: 'Scenario 3: Subscription Cut',
      title: 'Cancelling ₹189/mo YouTube Premium Share',
      description: 'Questioning recurring leakage: see how cancelling future payments on a non-essential subscription frees up ₹189, boosting your daily spending allowance.',
      icon: <Tv className="w-5 h-5 text-cyan" />,
      borderColor: 'border-cyan/30 hover:border-cyan',
      tagColor: 'bg-cyan/15 text-cyan',
      actionDecision: {
        type: 'cancel_subscription' as const,
        amount: 189,
        title: 'Cancel YouTube Premium Family Share',
        targetCommitmentId: 'comm-2'
      }
    },
    {
      id: 'scen-future-planning',
      badge: 'Scenario 4: Future Purchase Planning',
      title: 'Planning a ₹2,500 Tech Gear Purchase',
      description: 'Simulate a ₹2,500 purchase when an ₹800 hostel bill is due on Day 12. Compare buying immediately vs delaying until post-bill date vs choosing a budget alternative.',
      icon: <CalendarClock className="w-5 h-5 text-lavender" />,
      borderColor: 'border-lavender/30 hover:border-lavender',
      tagColor: 'bg-lavender/15 text-lavender',
      actionDecision: {
        type: 'buy_now' as const,
        amount: 2500,
        title: 'Mechanical Keyboard / Course Kit',
        category: 'education' as const,
        isEssential: false
      }
    },
    {
      id: 'scen-savings-allocation',
      badge: 'Scenario 5: Savings Allocation',
      title: 'Transferring ₹2,000 to Emergency Cushion',
      description: `Simulate locking ₹2,000 into your emergency reserve. Check if the remaining uncommitted cash (${formatINR(Math.max(0, metrics.uncommittedCash - 2000))}) provides sufficient flexible runway for the rest of the cycle.`,
      icon: <PiggyBank className="w-5 h-5 text-mint" />,
      borderColor: 'border-mint/30 hover:border-mint',
      tagColor: 'bg-mint/15 text-mint',
      actionDecision: {
        type: 'save_goal' as const,
        amount: 2000,
        title: 'Emergency Cushion Lock',
        category: 'other' as const,
        isEssential: true,
        targetGoalId: state.goals[0]?.id || 'goal-1'
      }
    }
  ];

  const handleReset = () => {
    resetDemo();
    onClose();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="guided-demo-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl my-6 rounded-2xl bg-gradient-to-b from-[#0D1220] to-[#080B12] border border-white/10 p-6 shadow-2xl space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-mint/15 border border-mint/25 text-mint shadow-glow-mint">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 id="guided-demo-title" className="text-lg font-heading font-bold text-white">Hackathon Demo Scenarios</h3>
              <p className="text-xs text-slate-400">
                5 interactive decision labs showing interconnected financial consequences in real-time.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close guided demo modal"
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-mint"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Guided Scenarios */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {scenarios.map((scen) => (
            <div
              key={scen.id}
              className={`p-4 rounded-xl bg-background-elevated/70 border ${scen.borderColor} flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all group`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-background-card border border-white/5 mt-0.5">
                  {scen.icon}
                </div>
                <div>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${scen.tagColor} font-semibold`}>
                    {scen.badge}
                  </span>
                  <h4 className="text-sm font-semibold text-white mt-1">{scen.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-md">
                    {scen.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onLaunchScenario(scen.actionDecision);
                  onClose();
                }}
                className="shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-mint hover:text-black font-semibold text-xs text-white border border-white/10 transition-all shadow-sm"
              >
                <span>Launch Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Reset Demo Footer for Judging */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Restore known benchmark for judges?
          </span>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-coral/10 hover:bg-coral/20 text-coral border border-coral/30 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Benchmark State</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
