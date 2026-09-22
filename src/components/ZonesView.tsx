import React, { useState } from 'react';
import { 
  Droplets, 
  Thermometer, 
  SunMedium, 
  Compass, 
  Sprout, 
  TrendingDown, 
} from 'lucide-react';
import { ZoneMicroclimate } from '../types';

interface ZonesViewProps {
  zones: ZoneMicroclimate[];
}

function TrendBars({
  points,
  maxValue,
  formatValue,
  barClass,
}: {
  points: { time: string; value: number }[];
  maxValue: number;
  formatValue: (v: number) => string;
  barClass: string;
}) {
  return (
    <div className="grid grid-cols-5 gap-2 items-end h-28 pt-2">
      {points.map((point, idx) => {
        const heightPercent = Math.min(100, Math.max(12, (point.value / maxValue) * 100));
        return (
          <div key={idx} className="flex flex-col items-center h-full justify-end">
            <span className="type-caption type-ink mb-1">{formatValue(point.value)}</span>
            <div className="w-full bg-[#211d19]/10 rounded-t-lg overflow-hidden h-full flex items-end">
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${barClass}`}
                style={{ height: `${heightPercent}%` }}
              />
            </div>
            <span className="type-micro mt-1">{point.time}</span>
          </div>
        );
      })}
    </div>
  );
}

export const ZonesView: React.FC<ZonesViewProps> = ({ zones }) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.zoneId || 'zone-1');
  const activeZone = zones.find((z) => z.zoneId === selectedZoneId) || zones[0];

  const statusPill = (status: string, label?: string) => {
    const isCritical = status === 'critical';
    const isWarning = status === 'warning';
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full type-caption border shrink-0 ${
          isCritical
            ? 'bg-[#d92d20] border-[#d92d20] pill-on-dark'
            : isWarning
            ? 'bg-[#facc15] border-[#facc15] pill-on-light'
            : 'bg-[#b4f53c] border-[#b4f53c] pill-on-light'
        }`}
      >
        {label ?? (status === 'optimal' ? 'Optimal' : status)}
      </span>
    );
  };

  return (
    <div id="zones-microclimate-view" className="space-y-2.5 animate-fade-in pb-12">
      <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="type-micro">Multi-zone telemetry</span>
              <span className="type-caption type-muted">·</span>
              <span className="type-micro">Under-canopy profile</span>
            </div>
            <h1 className="type-page-title">AgriPV zone sensing & crop phenology</h1>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#d3d0c9]/80 rounded-2xl border border-white/50">
            {zones.map((zone) => (
              <button
                key={zone.zoneId}
                onClick={() => setSelectedZoneId(zone.zoneId)}
                className={`px-3.5 py-1.5 rounded-xl type-body transition-all cursor-pointer ${
                  selectedZoneId === zone.zoneId
                    ? 'bg-[#1c1917] text-white'
                    : 'type-muted hover:text-[#211d19] hover:bg-white/50'
                }`}
              >
                {zone.zoneName.split('·')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          <div className="bg-[#d3d0c9]/65 p-3.5 rounded-2xl border border-white/50">
            <span className="type-micro block mb-1">Crop & phenological stage</span>
            <div className="type-card-title">{activeZone.crop}</div>
            <div className="type-caption type-muted mt-0.5 flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5" />
              <span>{activeZone.cropStage}</span>
            </div>
          </div>

          <div className="bg-[#d3d0c9]/65 p-3.5 rounded-2xl border border-white/50">
            <span className="type-micro block mb-1">Panel tilt & canopy shading</span>
            <div className="type-card-title">
              +{activeZone.panelTiltAngle.toFixed(1)}° tracker angle
            </div>
            <div className="type-caption type-muted mt-0.5 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              <span>{activeZone.shadingPercentage}% canopy protective shade</span>
            </div>
          </div>

          <div className="bg-[#d3d0c9]/65 p-3.5 rounded-2xl border border-white/50">
            <span className="type-micro block mb-1">Water conservation</span>
            <div className="type-card-title">
              {activeZone.waterUsageLitersPerM2} L/m² / day
            </div>
            <div className="type-caption type-muted mt-0.5 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>−{activeZone.waterSavingsVsBaselinePercent}% vs open field</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#1c1917] text-white flex items-center justify-center shrink-0">
                <Droplets className="w-4 h-4" fill="currentColor" strokeWidth={1.25} />
              </div>
              <div className="min-w-0">
                <span className="type-micro">Soil moisture profile</span>
                <h2 className="type-card-title">Root zone volumetric</h2>
              </div>
            </div>
            {statusPill(activeZone.soilMoisture.status)}
          </div>

          <div className="mb-3">
            <div className="type-hero">
              {activeZone.soilMoisture.current}
              <span className="type-body ml-1 type-muted">% VWC</span>
            </div>
          </div>

          <div className="bg-[#d3d0c9]/65 rounded-2xl p-3 border border-white/50">
            <div className="type-body mb-2 flex items-center justify-between gap-2">
              <span>24-hour soil moisture</span>
              <span className="type-caption type-muted">Depth 30 cm</span>
            </div>
            <TrendBars
              points={activeZone.soilMoisture.historical24h}
              maxValue={45}
              formatValue={(v) => `${v}%`}
              barClass="bg-[#211d19]"
            />
          </div>
        </div>

        <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#1c1917] text-white flex items-center justify-center shrink-0">
                <Thermometer className="w-4 h-4" fill="currentColor" strokeWidth={1.25} />
              </div>
              <div className="min-w-0">
                <span className="type-micro">Under-canopy temperature</span>
                <h2 className="type-card-title">Microclimate buffer</h2>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full type-caption bg-[#facc15] border border-[#facc15] pill-on-light">
              Heat protected
            </span>
          </div>

          <div className="mb-3">
            <div className="type-hero">
              {activeZone.temperature.current}
              <span className="type-body ml-1.5 type-muted">°C · −3.2° cooler</span>
            </div>
          </div>

          <div className="bg-[#d3d0c9]/65 rounded-2xl p-3 border border-white/50">
            <div className="type-body mb-2 flex items-center justify-between gap-2">
              <span>24-hour temperature</span>
              <span className="type-caption type-muted">No sunburn risk</span>
            </div>
            <TrendBars
              points={activeZone.temperature.historical24h}
              maxValue={35}
              formatValue={(v) => `${v}°`}
              barClass="bg-[#f04438]"
            />
          </div>
        </div>

        <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#1c1917] text-white flex items-center justify-center shrink-0">
                <Droplets className="w-4 h-4" fill="currentColor" strokeWidth={1.25} />
              </div>
              <div className="min-w-0">
                <span className="type-micro">Vapour pressure deficit</span>
                <h2 className="type-card-title">Relative humidity</h2>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full type-caption bg-[#b4f53c] border border-[#b4f53c] pill-on-light">
              Optimal VPD
            </span>
          </div>

          <div className="mb-3">
            <div className="type-hero">
              {activeZone.humidity.current}
              <span className="type-body ml-1 type-muted">% RH</span>
            </div>
          </div>

          <div className="bg-[#d3d0c9]/65 rounded-2xl p-3 border border-white/50">
            <div className="type-body mb-2 flex items-center justify-between gap-2">
              <span>24-hour humidity</span>
              <span className="type-caption type-muted">VPD 1.15 kPa</span>
            </div>
            <TrendBars
              points={activeZone.humidity.historical24h}
              maxValue={100}
              formatValue={(v) => `${v}%`}
              barClass="bg-[#797166]"
            />
          </div>
        </div>

        <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#1c1917] text-white flex items-center justify-center shrink-0">
                <SunMedium className="w-4 h-4" fill="currentColor" strokeWidth={1.25} />
              </div>
              <div className="min-w-0">
                <span className="type-micro">Photosynthetic radiation</span>
                <h2 className="type-card-title">PAR light level</h2>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full type-caption bg-[#facc15] border border-[#facc15] pill-on-light">
              Peak window
            </span>
          </div>

          <div className="mb-3">
            <div className="type-hero">
              {activeZone.lightLevelPAR.current}
              <span className="type-body ml-1 type-muted">µmol/m²/s</span>
            </div>
          </div>

          <div className="bg-[#d3d0c9]/65 rounded-2xl p-3 border border-white/50">
            <div className="type-body mb-2 flex items-center justify-between gap-2">
              <span>24-hour PAR</span>
              <span className="type-caption type-muted">DLI 38.4 mol/m²d</span>
            </div>
            <TrendBars
              points={activeZone.lightLevelPAR.historical24h}
              maxValue={1000}
              formatValue={(v) => `${v}`}
              barClass="bg-[#b4f53c]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
