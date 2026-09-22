import React from 'react';
import { Sprout } from 'lucide-react';
import { PanelTiltStatus } from '../types';

interface TrackerArrayStatusCardProps {
  tiltStatus: PanelTiltStatus;
}

export const TrackerArrayStatusCard: React.FC<TrackerArrayStatusCardProps> = ({
  tiltStatus,
}) => {
  const angleLabel =
    tiltStatus.currentAngle > 0
      ? `+${tiltStatus.currentAngle.toFixed(1)}°`
      : `${tiltStatus.currentAngle.toFixed(1)}°`;

  return (
    <div
      id="agripv-tracker-array-card"
      className="h-full min-h-0 bg-[#dcdad4] rounded-[20px] p-3 border border-white/50 flex flex-col select-none overflow-hidden"
    >
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-full bg-[#1c1917] flex items-center justify-center text-white shrink-0">
          <Sprout className="w-3.5 h-3.5" fill="currentColor" strokeWidth={1.25} />
        </div>
        <h2 className="type-card-title">Panel tilt</h2>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-center mt-2">
        <div className="type-micro">Current tilt</div>
        <div className="type-hero mt-0.5">{angleLabel}</div>

        <div className="relative mt-3 h-12 bg-white/45 rounded-xl px-3 flex items-center justify-center border border-white/60 overflow-hidden">
          <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 h-px border-b border-[#797166]/35" />
          <div
            className="relative w-32 h-3.5 bg-gradient-to-r from-[#1c1917] via-[#2d2925] to-[#1c1917] rounded-xs shadow-lg border border-[#3b82f6]/40 flex items-center justify-around px-1 transition-transform duration-500"
            style={{ transform: `rotate(${tiltStatus.currentAngle * 0.45}deg)` }}
          >
            <span className="w-0.5 h-2 bg-blue-400/60 rounded-xs" />
            <span className="w-0.5 h-2 bg-blue-400/60 rounded-xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#b4f53c]" />
            <span className="w-0.5 h-2 bg-blue-400/60 rounded-xs" />
            <span className="w-0.5 h-2 bg-blue-400/60 rounded-xs" />
          </div>
        </div>

        <div className="flex items-center justify-between type-caption mt-2 px-0.5">
          <span>−45° E</span>
          <span className="type-ink">0°</span>
          <span>+45° W</span>
        </div>
      </div>
    </div>
  );
};
