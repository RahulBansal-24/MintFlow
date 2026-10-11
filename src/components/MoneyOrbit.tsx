import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Headphones, 
  Wifi, 
  Tv, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  ShoppingBag,
  Zap
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { formatINR } from '../engine/currency';

interface OrbitSatellite {
  id: string;
  label: string;
  amount: number;
  type: 'spend' | 'commitment' | 'goal' | 'subscription';
  icon: React.ReactNode;
  color: string;
  orbitRadius: number; // in px
  duration: number; // animation seconds
  angleOffset: number; // in degrees
}

export const MoneyOrbit: React.FC<{ onOpenSimulator?: () => void }> = ({ onOpenSimulator }) => {
  const { metrics, state } = useFinancial();
  const [hoveredItem, setHoveredItem] = useState<OrbitSatellite | null>(null);

  // Satellites orbiting the central balance
  const satellites: OrbitSatellite[] = [
    // Orbit 1: Daily Flexible Spend (Inner ring - radius ~95px)
    {
      id: 'sat-allowance',
      label: 'Daily Allowance',
      amount: Math.round(metrics.dailyAllowance),
      type: 'spend',
      icon: <Zap className="w-3.5 h-3.5 text-mint" />,
      color: '#65F5B4',
      orbitRadius: 95,
      duration: 18,
      angleOffset: 0
    },
    {
      id: 'sat-today',
      label: "Today's Spent",
      amount: metrics.todaysSpent,
      type: 'spend',
      icon: <ShoppingBag className="w-3.5 h-3.5 text-amber" />,
      color: '#FFC66D',
      orbitRadius: 95,
      duration: 18,
      angleOffset: 180
    },

    // Orbit 2: Fixed Commitments (Middle ring - radius ~145px)
    {
      id: 'sat-hostel',
      label: 'Hostel Wi-Fi (Day 12)',
      amount: 800,
      type: 'commitment',
      icon: <Wifi className="w-3.5 h-3.5 text-cyan" />,
      color: '#55DDF5',
      orbitRadius: 145,
      duration: 26,
      angleOffset: 60
    },
    {
      id: 'sat-yt',
      label: 'YouTube Sub (Day 18)',
      amount: 189,
      type: 'subscription',
      icon: <Tv className="w-3.5 h-3.5 text-coral" />,
      color: '#FF777D',
      orbitRadius: 145,
      duration: 26,
      angleOffset: 240
    },

    // Orbit 3: Savings Goals & Cushion (Outer ring - radius ~195px)
    {
      id: 'sat-cushion',
      label: 'Emergency Cushion',
      amount: state.goals[0]?.savedAmount || 600,
      type: 'goal',
      icon: <Shield className="w-3.5 h-3.5 text-mint" />,
      color: '#65F5B4',
      orbitRadius: 195,
      duration: 36,
      angleOffset: 120
    },
    {
      id: 'sat-headphones',
      label: 'Sony Headphones Goal',
      amount: state.goals[1]?.savedAmount || 1200,
      type: 'goal',
      icon: <Headphones className="w-3.5 h-3.5 text-lavender" />,
      color: '#A89BFA',
      orbitRadius: 195,
      duration: 36,
      angleOffset: 300
    }
  ];

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#0D1220]/80 to-[#080B12] border border-white/[0.06] shadow-glass">
      {/* Background ambient cosmic glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-mint/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan/5 blur-3xl" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* SVG Orbital Track Rings */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        <g transform="translate(50%, 50%)">
          {/* Track 1: Inner (95px) */}
          <circle
            cx="0"
            cy="0"
            r="95"
            fill="none"
            stroke="rgba(101, 245, 180, 0.15)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />
          {/* Track 2: Middle (145px) */}
          <circle
            cx="0"
            cy="0"
            r="145"
            fill="none"
            stroke="rgba(85, 221, 245, 0.12)"
            strokeWidth="1.2"
            strokeDasharray="6 8"
          />
          {/* Track 3: Outer (195px) */}
          <circle
            cx="0"
            cy="0"
            r="195"
            fill="none"
            stroke="rgba(168, 155, 250, 0.1)"
            strokeWidth="1.2"
            strokeDasharray="8 10"
          />
        </g>
      </svg>

      {/* Orbiting Satellites with pure CSS/Framer motion rotations */}
      {satellites.map((sat) => {
        return (
          <div
            key={sat.id}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: sat.orbitRadius * 2,
              height: sat.orbitRadius * 2
            }}
          >
            <motion.div
              className="w-full h-full"
              animate={{ rotate: [sat.angleOffset, sat.angleOffset + 360] }}
              transition={{
                repeat: Infinity,
                duration: sat.duration,
                ease: 'linear'
              }}
            >
              {/* Satellite node at the top of its orbit */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                onMouseEnter={() => setHoveredItem(sat)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Counter-rotate icon so it stays upright */}
                <motion.div
                  animate={{ rotate: [-sat.angleOffset, -sat.angleOffset - 360] }}
                  transition={{
                    repeat: Infinity,
                    duration: sat.duration,
                    ease: 'linear'
                  }}
                  whileHover={{ scale: 1.25 }}
                  className="flex items-center justify-center w-8 h-8 rounded-full border shadow-lg backdrop-blur-md transition-all"
                  style={{
                    backgroundColor: 'rgba(13, 18, 32, 0.9)',
                    borderColor: hoveredItem?.id === sat.id ? sat.color : `${sat.color}55`,
                    boxShadow: hoveredItem?.id === sat.id ? `0 0 16px ${sat.color}88` : `0 0 8px ${sat.color}33`
                  }}
                >
                  {sat.icon}
                </motion.div>
              </div>
            </motion.div>
          </div>
        );
      })}

      {/* Central Core: Balance Sun */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        onClick={onOpenSimulator}
        className="relative z-10 flex flex-col items-center justify-center w-36 h-36 rounded-full bg-gradient-to-br from-[#111827] to-[#0A0E17] border-2 border-mint/40 shadow-glow-mint cursor-pointer group text-center p-3"
      >
        {/* Core pulsing outer ring */}
        <div className="absolute inset-0 rounded-full border border-mint/30 animate-ping opacity-25 pointer-events-none" />

        <div className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-mint/80 font-medium">
          <Sparkles className="w-3 h-3 text-mint animate-pulse" />
          <span>Money Orbit</span>
        </div>

        <div className="text-xl font-heading font-bold text-white tracking-tight mt-0.5">
          {formatINR(metrics.availableCash)}
        </div>

        <div className="text-[11px] text-slate-400 font-sans mt-0.5">
          Available Cash
        </div>

        <div className="mt-1 px-2 py-0.5 rounded-full bg-mint/10 border border-mint/20 text-[9px] font-medium text-mint flex items-center gap-1 group-hover:bg-mint group-hover:text-black transition-colors">
          <span>₹{Math.round(metrics.dailyAllowance)}/d safe</span>
        </div>
      </motion.div>

      {/* Floating Info Pill on Satellite Hover */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-background-elevated/95 border border-white/10 shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs"
          >
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: hoveredItem.color }} 
            />
            <span className="font-medium text-white">{hoveredItem.label}:</span>
            <span className="font-heading font-semibold text-mint">{formatINR(hoveredItem.amount)}</span>
            <span className="text-slate-400 capitalize">({hoveredItem.type})</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Orbit Legend */}
      <div className="absolute top-3 left-4 flex items-center gap-2 text-[11px] text-slate-400">
        <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
        <span className="font-mono">Live Orbit • Day 8 of 30</span>
      </div>

      <div className="absolute top-3 right-4 flex items-center gap-3 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-mint" />
          <span>Flexible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan" />
          <span>Bills</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-lavender" />
          <span>Goals</span>
        </div>
      </div>
    </div>
  );
};
