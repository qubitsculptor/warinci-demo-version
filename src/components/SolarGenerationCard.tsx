import React from 'react';
import { Zap } from 'lucide-react';
import { EnergyTelemetry } from '../types';

interface SolarGenerationCardProps {
  energy: EnergyTelemetry;
  onOpenAnalytics?: () => void;
}

export const SolarGenerationCard: React.FC<SolarGenerationCardProps> = ({
  energy,
  onOpenAnalytics,
}) => {
  const gridRevenue = Math.round(energy.dailyYieldMWh * 1000 * energy.gridExportRateDollars);
  const capPercent = Math.round(
    Math.min(Math.max(energy.liveKw / energy.ratedCapacityKw, 0), 1) * 100
  );

  return (
    <div
      id="solar-pv-generation-card"
      onClick={onOpenAnalytics}
      title="Open energy analytics"
      className="h-full min-h-0 bg-[#dcdad4] rounded-[20px] p-3 border border-white/50 flex flex-col select-none cursor-pointer hover:border-white/80 transition-all overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#1c1917] flex items-center justify-center text-white shrink-0">
            <Zap className="w-3.5 h-3.5" fill="currentColor" strokeWidth={1.25} />
          </div>
          <h2 className="type-card-title truncate">Solar output</h2>
        </div>
        <span className="type-caption type-muted tabular-nums shrink-0">{capPercent}% rated</span>
      </div>

      <div className="relative flex-1 min-h-0 flex flex-col items-center justify-center">
        <svg viewBox="0 0 170 95" className="w-full max-w-[150px] h-auto max-h-full overflow-visible">
          {[...Array(25)].map((_, i) => {
            const angle = Math.PI - (i / 24) * Math.PI;
            const x1 = 85 + 72 * Math.cos(angle);
            const y1 = 90 - 72 * Math.sin(angle);
            const x2 = 85 + 67 * Math.cos(angle);
            const y2 = 90 - 67 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#ffffff"
                strokeWidth="1.5"
                className="opacity-70"
              />
            );
          })}
          <path
            d="M 23,90 A 62 62 0 0 1 147,90"
            fill="none"
            stroke="url(#solarOutputGaugeGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="solarOutputGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff4d1a" />
              <stop offset="35%" stopColor="#ffe600" />
              <stop offset="70%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#b4f53c" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute bottom-0 text-center">
          <div className="type-micro">Live</div>
          <div className="type-hero">
            {energy.liveKw}
            <span className="type-body ml-0.5 type-muted">kW</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 shrink-0 pt-1">
        <div className="bg-[#d3d0c9]/65 rounded-[14px] px-2.5 py-2 border border-white/50">
          <div className="type-micro">Today</div>
          <div className="type-card-title tabular-nums mt-0.5">{energy.dailyYieldMWh} MWh</div>
        </div>
        <div className="bg-[#d3d0c9]/65 rounded-[14px] px-2.5 py-2 border border-white/50">
          <div className="type-micro">Grid credit</div>
          <div className="type-card-title tabular-nums mt-0.5">${gridRevenue}</div>
        </div>
      </div>
    </div>
  );
};
