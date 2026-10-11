import React, { useState } from 'react';
import { Sliders, AlertTriangle, Shield, HeartPulse, Laptop, Bus, HelpCircle, ArrowRight } from 'lucide-react';
import { SpendSimulatorView } from '../components/SpendSimulatorView';
import { SimulationDecision } from '../engine/types';

export const SimulatorPage: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<Partial<SimulationDecision> | null>(null);

  const emergencyScenarios = [
    {
      title: 'Laptop Repair',
      amount: 1800,
      icon: <Laptop className="w-4 h-4 text-cyan" />,
      decision: {
        type: 'emergency' as const,
        amount: 1800,
        title: 'Emergency: Laptop Screen / Battery Repair',
        category: 'bills' as const,
        isEssential: true
      }
    },
    {
      title: 'Medical / Dental Care',
      amount: 1200,
      icon: <HeartPulse className="w-4 h-4 text-coral" />,
      decision: {
        type: 'emergency' as const,
        amount: 1200,
        title: 'Emergency: Doctor Consultation & Medicines',
        category: 'health' as const,
        isEssential: true
      }
    },
    {
      title: 'Urgent Home Travel',
      amount: 1500,
      icon: <Bus className="w-4 h-4 text-amber" />,
      decision: {
        type: 'emergency' as const,
        amount: 1500,
        title: 'Emergency: Tatkal Train Ticket Home',
        category: 'transport' as const,
        isEssential: true
      }
    },
    {
      title: 'Lost Smartphone Display',
      amount: 2500,
      icon: <AlertTriangle className="w-4 h-4 text-coral" />,
      decision: {
        type: 'emergency' as const,
        amount: 2500,
        title: 'Emergency: Phone Screen Replacement',
        category: 'bills' as const,
        isEssential: true
      }
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Emergency Shortcuts Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-coral/10 via-background-card to-background-card border border-coral/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-coral" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-coral font-bold">
              Stress Test Laboratory: Sudden Emergencies
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Test how a sudden non-negotiable expense affects your remaining runway and upcoming commitments.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {emergencyScenarios.map((scen, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedPreset({ ...scen.decision })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background-elevated hover:bg-white/[0.08] border border-white/10 text-xs text-slate-200 transition-colors"
            >
              {scen.icon}
              <span>{scen.title} (₹{scen.amount})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Spend Simulator Component */}
      <SpendSimulatorView 
        key={JSON.stringify(selectedPreset)}
        initialDecision={selectedPreset || undefined}
      />

      {/* Philosophy Callout */}
      <div className="p-4 rounded-xl bg-background-elevated/40 border border-white/[0.05] text-xs text-slate-400 flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-mint shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-200 block">How the Simulator Works:</strong>
          <p className="leading-relaxed">
            All calculations in this lab are executed in an isolated sandbox clone of your financial state.
            Nothing is saved to your budget until you explicitly click <strong>"Confirm Decision"</strong>.
            If an expense is unaffordable, explore our smart alternatives to adjust amounts or delay purchases.
          </p>
        </div>
      </div>
    </div>
  );
};
