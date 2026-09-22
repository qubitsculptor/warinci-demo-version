import React, { useState } from 'react';
import {
  Zap,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Search,
  Wifi,
} from 'lucide-react';
import {
  AgriPvSite,
  DeviceSensor,
  EnergyTelemetry,
  PanelTiltStatus,
} from '../types';
import { TrackerArrayStatusCard } from './TrackerArrayStatusCard';

interface SolarViewProps {
  site: AgriPvSite;
  energy: EnergyTelemetry;
  tiltStatus: PanelTiltStatus;
  devices: DeviceSensor[];
  onExportCsv: () => void;
  onExportJson: () => void;
}

const YIELD_COLS = [
  { label: 'S1', expected: 48, actual: 44 },
  { label: 'S2', expected: 55, actual: 52 },
  { label: 'S3', expected: 82, actual: 78 },
  { label: 'S4', expected: 52, actual: 49 },
  { label: 'S5', expected: 38, actual: 41 },
];

export const SolarView: React.FC<SolarViewProps> = ({
  site,
  energy,
  tiltStatus,
  devices,
  onExportCsv,
  onExportJson,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const gridRevenue = Math.round(
    energy.dailyYieldMWh * 1000 * energy.gridExportRateDollars,
  );
  const capPercent = Math.round(
    Math.min(Math.max(energy.liveKw / energy.ratedCapacityKw, 0), 1) * 100,
  );

  const filteredDevices = devices.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.model.toLowerCase().includes(q) ||
      d.zone.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );
  });

  const onlineCount = devices.filter((d) => d.status === 'online').length;
  const warningCount = devices.filter((d) => d.status === 'warning').length;
  const offlineCount = devices.filter((d) => d.status === 'offline').length;

  const handleCsv = () => {
    onExportCsv();
    setExportNotice('Energy generation CSV downloaded.');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleJson = () => {
    onExportJson();
    setExportNotice('Solar telemetry JSON exported.');
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <div id="solar-operations-view" className="space-y-1.5 animate-fade-in pb-12">
      <div className="bg-[#dcdad4] rounded-[24px] p-4 sm:p-5 border border-white/50">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="type-micro">PV fleet</span>
              <span className="type-caption type-muted">·</span>
              <span className="type-micro truncate">{site.name}</span>
            </div>
            <h1 className="type-page-title">Solar operations</h1>
            <p className="type-body type-muted mt-1 max-w-xl">
              Generation, tracker posture, hardware health, and export reports.
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCsv}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#d3d0c9]/80 hover:bg-[#d3d0c9] type-body border border-white/50 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={handleJson}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1c1917] hover:bg-black type-body text-white transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              JSON
            </button>
          </div>
        </div>
        {exportNotice && (
          <div className="mt-3 bg-[#d3d0c9]/80 type-ink p-2.5 rounded-xl type-body flex items-center gap-2 border border-white/50">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
        <div className="bg-[#dcdad4] rounded-[20px] p-4 border border-white/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-[#1c1917] text-white flex items-center justify-center">
              <Zap className="w-3.5 h-3.5" fill="currentColor" strokeWidth={1.25} />
            </div>
            <span className="type-micro">Live output</span>
          </div>
          <div className="type-hero">
            {energy.liveKw}
            <span className="type-body ml-1 type-muted">kW</span>
          </div>
          <div className="type-caption type-muted mt-1">{capPercent}% of rated capacity</div>
        </div>
        <div className="bg-[#dcdad4] rounded-[20px] p-4 border border-white/50">
          <span className="type-micro">Today</span>
          <div className="type-hero mt-2">
            {energy.dailyYieldMWh.toFixed(2)}
            <span className="type-body ml-1 type-muted">MWh</span>
          </div>
          <div className="type-caption type-muted mt-1">Daily yield</div>
        </div>
        <div className="bg-[#dcdad4] rounded-[20px] p-4 border border-white/50">
          <span className="type-micro">Grid credit</span>
          <div className="type-hero mt-2">
            ${gridRevenue}
          </div>
          <div className="type-caption type-muted mt-1">
            @ ${energy.gridExportRateDollars.toFixed(2)}/kWh
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 min-h-[220px]">
        <div className="min-h-[220px]">
          <TrackerArrayStatusCard tiltStatus={tiltStatus} />
        </div>

        <div className="bg-[#dcdad4] rounded-[20px] p-4 border border-white/50 flex flex-col min-h-[220px]">
          <div className="flex items-center justify-between shrink-0 mb-2">
            <h2 className="type-card-title">Dual yield</h2>
            <div className="flex items-center gap-2.5 type-caption">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-xs bg-[#b4f53c]" /> Expected
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-xs bg-[#f04438]" /> Actual
              </span>
            </div>
          </div>
          <div className="text-center shrink-0 py-1">
            <div className="type-hero">
              1.77<span className="type-body ml-1 type-muted">LER</span>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1.5 items-end flex-1 min-h-0 px-0.5">
            {YIELD_COLS.map((col) => (
              <div key={col.label} className="flex flex-col items-center gap-0.5 h-full justify-end">
                <div className="flex items-end gap-0.5 flex-1 w-full justify-center min-h-0 max-h-24">
                  <div
                    className="w-2 bg-[#b4f53c] rounded-t-xs"
                    style={{ height: `${col.expected}%` }}
                  />
                  <div
                    className="w-2 bg-[#f04438] rounded-t-xs"
                    style={{ height: `${col.actual}%` }}
                  />
                </div>
                <span className="type-caption">{col.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#dcdad4] rounded-[20px] p-4 border border-white/50">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="type-card-title">Hardware fleet</h2>
            <div className="type-caption type-muted mt-0.5">Inverters, trackers, sensors</div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-[#b4f53c] border border-[#b4f53c] type-caption pill-on-light">
              {onlineCount} online
            </span>
            {warningCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#facc15] border border-[#facc15] type-caption pill-on-light">
                {warningCount} attention
              </span>
            )}
            {offlineCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#d92d20] type-caption pill-on-dark">
                {offlineCount} offline
              </span>
            )}
          </div>
        </div>

        <div className="relative mb-3 max-w-md">
          <Search className="w-3.5 h-3.5 type-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search devices…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#d3d0c9]/70 rounded-xl type-body border border-white/60 focus:outline-hidden placeholder-[#797166]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          {filteredDevices.map((device) => (
            <div
              key={device.id}
              className="bg-[#d3d0c9]/65 rounded-[16px] p-3.5 border border-white/50 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="type-micro truncate">{device.category}</div>
                  <div className="type-card-title truncate">{device.name}</div>
                  <div className="type-caption type-muted truncate">{device.model}</div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full type-caption shrink-0 ${
                    device.status === 'offline'
                      ? 'bg-[#d92d20] pill-on-dark'
                      : device.status === 'warning'
                        ? 'bg-[#facc15] border border-[#facc15] pill-on-light'
                        : 'bg-[#b4f53c] border border-[#b4f53c] pill-on-light'
                  }`}
                >
                  {device.status}
                </span>
              </div>
              <div className="flex items-center justify-between type-caption pt-1 border-t border-[#211d19]/10">
                <span className="inline-flex items-center gap-1 type-ink">
                  <Wifi className="w-3.5 h-3.5" />
                  {device.batteryOrSignal}
                </span>
                <span className="type-muted truncate ml-2">{device.zone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#dcdad4] rounded-[20px] p-4 border border-white/50">
        <h2 className="type-card-title mb-1">Reports</h2>
        <p className="type-body type-muted mb-3">
          Download generation and irradiance bundles for the current production cycle.
        </p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={handleCsv}
            className="px-3.5 py-2 rounded-xl bg-[#1c1917] text-white type-body hover:bg-black cursor-pointer"
          >
            Export energy CSV
          </button>
          <button
            onClick={handleJson}
            className="px-3.5 py-2 rounded-xl bg-[#d3d0c9]/80 type-body border border-white/50 hover:bg-[#d3d0c9] cursor-pointer"
          >
            Export telemetry JSON
          </button>
        </div>
      </div>
    </div>
  );
};
