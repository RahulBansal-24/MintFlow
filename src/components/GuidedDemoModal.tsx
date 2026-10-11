import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  ShoppingBag, 
  AlertTriangle, 
  Tv, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2,
  Sliders
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

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'scen-impulse',
      badge: 'Scenario 1: Impulse Buy',
      title: 'The ₹1,500 Sneaker / Earbuds Temptation',
      description: 'You spot a flash sale on trendy earbuds for ₹1,500. See how this single buy slices your daily flexible spend from ₹' + Math.round(metrics.dailyAllowance) + '/d down to ₹' + Math.round((metrics.uncommittedCash - 1500) / metrics.remainingDays) + '/d.',
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
      description: 'Your laptop screen gets cracked right before midterm submissions. Explore how this unexpected hit affects upcoming bills and how the recovery planner guides you back to safety.',
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
      description: 'Questioning recurring leakage: see how cancelling a non-essential subscription frees up ₹189 immediately, protecting upcoming hostel bills and boosting goal runway.',
      icon: <Tv className="w-5 h-5 text-cyan" />,
      borderColor: 'border-cyan/30 hover:border-cyan',
      tagColor: 'bg-cyan/15 text-cyan',
      actionDecision: {
        type: 'cancel_subscription' as const,
        amount: 189,
        title: 'Cancel YouTube Premium Family Share',
        targetCommitmentId: 'comm-2'
      }
    }
  ];

  const handleReset = () => {
    resetDemo();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-[#0D1220] to-[#080B12] border border-white/10 p-6 shadow-2xl space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-mint/15 border border-mint/25 text-mint shadow-glow-mint">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-white">Hackathon Demo Lab</h3>
              <p className="text-xs text-slate-400">
                Select an interactive scenario to preview interconnected financial consequences.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Guided Scenarios */}
        <div className="space-y-3">
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
            Need a fresh start for judges?
          </span>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-coral/10 hover:bg-coral/20 text-coral border border-coral/30 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo to Day 8 Seed</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
