import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  Check,
} from 'lucide-react';

import { 
  AgriPvSite, 
  PriorityMode, 
  CvDetectedIssue, 
  PanelTiltStatus, 
  EnergyTelemetry, 
  WaterTelemetry, 
  ZoneMicroclimate 
} from '../types';
import { FieldArrayTelemetry } from './FieldArrayTelemetry';
import { TrackerArrayStatusCard } from './TrackerArrayStatusCard';
import { SolarGenerationCard } from './SolarGenerationCard';
import { WeatherCard } from './WeatherCard';

interface DashboardViewProps {
  site: AgriPvSite;
  sites: AgriPvSite[];
  onSelectSite: (site: AgriPvSite) => void;
  priorityMode: PriorityMode;
  onChangePriorityMode: (mode: PriorityMode) => void;
  energy: EnergyTelemetry;
  tiltStatus: PanelTiltStatus;
  waterTelemetry: WaterTelemetry;
  zones: ZoneMicroclimate[];
  cvIssues: CvDetectedIssue[];
  onSelectCvIssue: (issue: CvDetectedIssue) => void;
  onTriggerWatering: () => void;
  onToggleSnooze: () => void;
  onOpenSchedule?: () => void;
  onOpenAnalytics?: () => void;
  onOpenZones?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  site,
  sites,
  onSelectSite,
  priorityMode,
  onChangePriorityMode,
  energy,
  tiltStatus,
  waterTelemetry,
  zones,
  cvIssues,
  onSelectCvIssue,
  onTriggerWatering,
  onToggleSnooze,
  onOpenSchedule,
  onOpenAnalytics,
  onOpenZones,
}) => {
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);

  return (
    <div
      id="agripv-main-dashboard-canvas"
      className="dashboard-fit h-auto lg:h-full min-h-0 flex flex-col gap-1.5 lg:gap-2 select-none lg:overflow-hidden"
    >
      {/* Two columns: shared top band (controls/title | top cards), then matched card stacks */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.24fr_1fr] gap-1 lg:gap-1.5 mt-4">
        {/* LEFT — top band matches right top cards so 6 cards align with trackers */}
        <div className="flex flex-col gap-1 lg:gap-1.5 min-h-0">
          <div className="shrink-0 h-[128px] flex flex-col justify-start gap-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap min-w-0 h-10">
              <button
                id="back-button-pill"
                onClick={onOpenZones}
                title="Overview of Field Zones"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#dcdad4]/80 hover:bg-[#d3d0c9] type-body border border-white/40 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <div className="relative">
                <button
                  id="site-selector-dropdown-btn"
                  onClick={() => {
                    setSiteDropdownOpen(!siteDropdownOpen);
                    setPriorityDropdownOpen(false);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#dcdad4]/80 hover:bg-[#d3d0c9] type-body border border-white/40 transition-colors cursor-pointer"
                >
                  <span>📍 {site.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#797166]" />
                </button>

                {siteDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-72 rounded-2xl bg-[#ffffff]/95 backdrop-blur-md shadow-xl border border-[#211d19]/10 p-2 z-50">
                    <div className="px-2.5 py-1 type-micro">AgriPV farm parcels</div>
                    {sites.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          onSelectSite(s);
                          setSiteDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl type-body transition-colors cursor-pointer ${
                          site.id === s.id ? 'bg-[#1c1917] text-white' : 'hover:bg-black/5 text-[#211d19]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{s.name}</span>
                          {site.id === s.id && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div className={`type-caption mt-0.5 ${site.id === s.id ? 'text-white/60' : ''}`}>
                          {s.totalHectares} Ha · {s.installedPVPowermWp} MWp
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  id="field-operations-dropdown-btn"
                  onClick={() => {
                    setPriorityDropdownOpen(!priorityDropdownOpen);
                    setSiteDropdownOpen(false);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#dcdad4]/80 hover:bg-[#d3d0c9] type-body border border-white/40 transition-colors cursor-pointer"
                >
                  <span>
                    {priorityMode === 'crop-weighted' ? 'Crop focus' :
                     priorityMode === 'energy-weighted' ? 'Solar focus' : 'Recovery'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#797166]" />
                </button>

                {priorityDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-64 rounded-2xl bg-[#ffffff]/95 backdrop-blur-md shadow-xl border border-[#211d19]/10 p-2 z-50">
                    <div className="px-2.5 py-1 type-micro">Priority mode</div>
                    {[
                      { id: 'crop-weighted', label: 'Crop focus', desc: 'Cool shade & PAR balance' },
                      { id: 'energy-weighted', label: 'Solar focus', desc: 'Max grid export' },
                      { id: 'recovery mode', label: 'Recovery', desc: 'Flat stow for soil rest' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => {
                          onChangePriorityMode(mode.id as PriorityMode);
                          setPriorityDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl type-body transition-colors cursor-pointer ${
                          priorityMode === mode.id ? 'bg-[#1c1917] text-white' : 'hover:bg-black/5 text-[#211d19]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{mode.label}</span>
                          {priorityMode === mode.id && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div className={`type-caption mt-0.5 ${priorityMode === mode.id ? 'text-white/60' : ''}`}>
                          {mode.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <h1 className="type-page-title truncate">Warinci Demo Farm</h1>
          </div>

          {/* 6 cards — same height as right trackers column */}
          <div className="flex-1 min-h-0 flex flex-col gap-1 lg:gap-1.5">
          {/* Row 1: solar + solar system tasks — equal height/width */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-1 lg:gap-1.5">
            <SolarGenerationCard energy={energy} onOpenAnalytics={onOpenAnalytics} />
            <div
              id="solar-system-active-tasks-card"
              className="h-full min-h-0 bg-[#dcdad4] rounded-[20px] p-3 border border-white/50 flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between shrink-0 gap-2">
                <h2 className="type-card-title relative z-10">Solar system tasks</h2>
                <button
                  onClick={onOpenSchedule}
                  className="type-caption hover:text-[#211d19] cursor-pointer transition-colors shrink-0"
                >
                  View all
                </button>
              </div>

              <div className="flex-1 min-h-0 flex flex-col justify-center">
                <div
                  className="overflow-hidden shrink-0"
                  style={{ height: 'calc(2 * 3.25rem + 1 * 0.5rem)' }}
                >
                  <div className="h-full overflow-y-auto scrollbar-hide flex flex-col gap-2 pr-0">
                    {[
                      { title: 'Inverter string sync', detail: 'Array B · Bays 3–6', status: 'in-progress' as const },
                      { title: 'Bifacial wash cycle', detail: 'Rows 1–8 · 14:00', status: 'scheduled' as const },
                      { title: 'Grid export ramp', detail: 'PPA peak window', status: 'in-progress' as const },
                      { title: 'Tracker recalibrate', detail: 'Rows 12–18 · Dawn', status: 'scheduled' as const },
                      { title: 'Optimizer firmware', detail: 'Zone C · Overnight', status: 'scheduled' as const },
                    ].map((task) => (
                    <div
                      key={task.title}
                      className="h-[3.25rem] bg-[#d3d0c9]/70 rounded-[14px] px-3 flex items-center justify-between gap-2 shrink-0 border border-white/30"
                    >
                      <div className="min-w-0">
                        <div className="type-card-title truncate leading-tight">{task.title}</div>
                        <div className="type-body type-muted truncate leading-tight mt-0.5">{task.detail}</div>
                      </div>
                      <span
                        className={`task-status-pill px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${
                          task.status === 'in-progress' ? 'bg-[#b4f53c]' : 'bg-[#facc15]'
                        }`}
                      >
                        {task.status === 'in-progress' ? 'In progress' : 'Scheduled'}
                      </span>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: crop distribution + active tasks — equal height/width */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-1 lg:gap-1.5">
            <div
              id="crop-distribution-hectares-card"
              onClick={onOpenZones}
              title="Open field zones"
              className="h-full min-h-0 bg-[#dcdad4] rounded-[20px] p-3 border border-white/50 flex flex-col cursor-pointer hover:border-white/80 transition-colors overflow-hidden"
            >
              <h2 className="type-card-title shrink-0">Crop distribution</h2>

              <div className="flex-1 min-h-0 flex flex-col justify-center gap-3">
                {[
                  {
                    name: 'Apples',
                    pct: '38.5%',
                    ha: '14.5 Ha',
                    icon: (
                      <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current" aria-hidden>
                        <path d="M8.2 2.2c.4-.9 1.2-1.5 2.2-1.6-.1 1.1-.6 2.1-1.5 2.7C8.2 2.9 8 2.5 8.2 2.2z" />
                        <path d="M8 4.2c-2.8 0-5 2.4-5 5.3C3 12.4 5.2 15 8 15s5-2.6 5-5.5c0-2.9-2.2-5.3-5-5.3z" />
                      </svg>
                    ),
                  },
                  {
                    name: 'Cherries',
                    pct: '32.3%',
                    ha: '13.5 Ha',
                    icon: (
                      <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current" aria-hidden>
                        <circle cx="6.2" cy="10" r="3.2" />
                        <circle cx="10.5" cy="9.2" r="2.6" />
                        <path d="M8.2 2.5c.1 1.4-.4 2.6-1.2 3.4.9-.2 1.8-.1 2.6.3-.2-1.5-.7-2.8-1.4-3.7z" />
                      </svg>
                    ),
                  },
                  {
                    name: 'Peaches',
                    pct: '29.2%',
                    ha: '18.5 Ha',
                    icon: (
                      <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current" aria-hidden>
                        <path d="M8.3 1.8c.5 1.1.4 2.2 0 3.1C9.5 4.5 11 4.2 12 3.5c-.9 1.6-2.5 2.5-4.2 2.6 1.6.4 2.8 1.6 3.4 3.2-.9-1-2.2-1.6-3.5-1.6-2.6 0-4.7 2.3-4.7 5.1 0 .4 0 .8.1 1.1C2.2 12.2 1.5 10.4 1.5 8.4 1.5 4.9 4.4 2.2 8 2.2c.1 0 .2 0 .3-.4z" />
                        <ellipse cx="8.2" cy="11.2" rx="4.2" ry="3.6" />
                      </svg>
                    ),
                  },
                ].map((crop) => (
                  <div key={crop.name} className="flex items-center gap-3 type-card-title type-ink">
                    <span className="shrink-0 flex items-center justify-center w-4 h-4">
                      {crop.icon}
                    </span>
                    <span className="flex-1 min-w-0 truncate">{crop.name}</span>
                    <span className="tabular-nums shrink-0 w-12 text-right">{crop.pct}</span>
                    <span className="tabular-nums shrink-0 w-14 text-right">{crop.ha}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              id="active-tasks-card"
              className="h-full min-h-0 bg-[#dcdad4] rounded-[20px] p-3 border border-white/50 flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between shrink-0 gap-2">
                <h2 className="type-card-title relative z-10">Active tasks</h2>
                <button
                  onClick={onOpenSchedule}
                  className="type-caption hover:text-[#211d19] cursor-pointer transition-colors shrink-0"
                >
                  View all
                </button>
              </div>

              <div className="flex-1 min-h-0 flex flex-col justify-center">
                <div
                  className="overflow-hidden shrink-0"
                  style={{ height: 'calc(2 * 3.25rem + 1 * 0.5rem)' }}
                >
                  <div className="h-full overflow-y-auto scrollbar-hide flex flex-col gap-2 pr-0">
                    {[
                      { title: 'Heat-shield tilt', detail: '+14° W · Row 14', status: 'in-progress' as const },
                      { title: 'Micro-drip', detail: 'Sector 4B · 35 min', status: 'in-progress' as const },
                      { title: 'Canopy PAR balance', detail: 'Rows 20–28 · 16:30', status: 'scheduled' as const },
                      { title: 'Soil probe check', detail: 'Zone A · Evening', status: 'scheduled' as const },
                      { title: 'Frost curtain test', detail: 'Parcel edge · Dawn', status: 'scheduled' as const },
                    ].map((task) => (
                      <div
                        key={task.title}
                        className="h-[3.25rem] bg-[#d3d0c9]/70 rounded-[14px] px-3 flex items-center justify-between gap-2 shrink-0 border border-white/30"
                      >
                        <div className="min-w-0">
                          <div className="type-card-title truncate leading-tight">{task.title}</div>
                          <div className="type-body type-muted truncate leading-tight mt-0.5">{task.detail}</div>
                        </div>
                        <span
                          className={`task-status-pill px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${
                            task.status === 'in-progress' ? 'bg-[#b4f53c]' : 'bg-[#facc15]'
                          }`}
                        >
                          {task.status === 'in-progress' ? 'In progress' : 'Scheduled'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: panel tilt + weather — equal height/width */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-1 lg:gap-1.5">
            <div className="h-full min-h-0">
              <TrackerArrayStatusCard tiltStatus={tiltStatus} />
            </div>

            <WeatherCard />

            {/* Dual yield — kept for later, not shown
            <div
              id="yield-bar-chart-card"
              onClick={onOpenAnalytics}
              title="Open analytics"
              className="h-full min-h-0 bg-[#dcdad4] rounded-[20px] p-3 border border-white/50 flex flex-col justify-between cursor-pointer hover:border-white/80 transition-colors overflow-hidden"
            >
              <div className="flex items-center justify-between shrink-0">
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

              <div className="text-center shrink-0 py-0.5">
                <div className="type-hero">
                  1.77<span className="type-body ml-1 type-muted">LER</span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-1.5 items-end flex-1 min-h-0 px-0.5">
                {[
                  { label: 'S1', expected: 48, actual: 44 },
                  { label: 'S2', expected: 55, actual: 52 },
                  { label: 'S3', expected: 82, actual: 78 },
                  { label: 'S4', expected: 52, actual: 49 },
                  { label: 'S5', expected: 38, actual: 41 },
                ].map((col, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-0.5 h-full justify-end">
                    <div className="flex items-end gap-0.5 flex-1 w-full justify-center min-h-0 max-h-16">
                      <div
                        className="w-1.5 bg-[#b4f53c] rounded-t-xs"
                        style={{ height: `${col.expected}%` }}
                      />
                      <div
                        className="w-1.5 bg-[#f04438] rounded-t-xs"
                        style={{ height: `${col.actual}%` }}
                      />
                    </div>
                    <span className="type-caption">{col.label}</span>
                  </div>
                ))}
              </div>
            </div>
            */}
          </div>
          </div>
        </div>

        {/* RIGHT — top cards + trackers flush beneath */}
        <div className="flex flex-col gap-1 lg:gap-1.5 min-h-0">
          <div className="flex items-stretch gap-1.5 w-full min-w-0 h-[128px] shrink-0">
            <div
              id="apples-crop-card"
              onClick={() => onSelectCvIssue(cvIssues[0])}
              title="Inspect apple diagnostic"
              className="flex-1 h-full bg-[#dcdad4] rounded-[18px] p-1.5 border border-white/50 flex flex-col cursor-pointer hover:scale-[1.02] transition-all min-w-0"
            >
              <div className="flex items-center justify-between type-caption type-ink px-0.5">
                <span className="inline-flex items-center gap-1 min-w-0">
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current shrink-0" aria-hidden>
                    <path d="M8.2 2.2c.4-.9 1.2-1.5 2.2-1.6-.1 1.1-.6 2.1-1.5 2.7C8.2 2.9 8 2.5 8.2 2.2z" />
                    <path d="M8 4.2c-2.8 0-5 2.4-5 5.3C3 12.4 5.2 15 8 15s5-2.6 5-5.5c0-2.9-2.2-5.3-5-5.3z" />
                  </svg>
                  <span className="truncate">Apples</span>
                </span>
                <span>R14</span>
              </div>
              <div className="relative flex-1 min-h-0 rounded-[12px] overflow-hidden mt-1 bg-black/5">
                <img
                  src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80"
                  alt="Apples"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 inset-x-1 flex justify-center">
                  <span className="px-1.5 py-0.5 rounded-full bg-[#d92d20] type-caption pill-on-dark whitespace-nowrap">
                    94.8% mildew
                  </span>
                </div>
              </div>
            </div>

            <div
              id="cherries-crop-card"
              onClick={() => onSelectCvIssue(cvIssues[1])}
              title="Inspect cherry diagnostic"
              className="flex-1 h-full bg-[#dcdad4] rounded-[18px] p-1.5 border border-white/50 flex flex-col cursor-pointer hover:scale-[1.02] transition-all min-w-0"
            >
              <div className="flex items-center justify-between type-caption type-ink px-0.5">
                <span className="inline-flex items-center gap-1 min-w-0">
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current shrink-0" aria-hidden>
                    <circle cx="6.2" cy="10" r="3.2" />
                    <circle cx="10.5" cy="9.2" r="2.6" />
                    <path d="M8.2 2.5c.1 1.4-.4 2.6-1.2 3.4.9-.2 1.8-.1 2.6.3-.2-1.5-.7-2.8-1.4-3.7z" />
                  </svg>
                  <span className="truncate">Cherries</span>
                </span>
                <span>R28</span>
              </div>
              <div className="relative flex-1 min-h-0 rounded-[12px] overflow-hidden mt-1 bg-black/5">
                <img
                  src="/cherry.jpeg"
                  alt="Cherries"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 inset-x-1 flex justify-center">
                  <span className="px-1.5 py-0.5 rounded-full bg-[#d92d20] type-caption pill-on-dark whitespace-nowrap">
                    91.2% moth
                  </span>
                </div>
              </div>
            </div>

            <div
              id="peaches-crop-card"
              onClick={() => onSelectCvIssue(cvIssues[2])}
              title="Inspect peach diagnostic"
              className="flex-1 h-full bg-[#dcdad4] rounded-[18px] p-1.5 border border-white/50 flex flex-col cursor-pointer hover:scale-[1.02] transition-all min-w-0"
            >
              <div className="flex items-center justify-between type-caption type-ink px-0.5">
                <span className="inline-flex items-center gap-1 min-w-0">
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current shrink-0" aria-hidden>
                    <path d="M8.1 2.1c.5-.8 1.3-1.3 2.2-1.4-.2 1-.7 1.9-1.5 2.5-.4-.4-.6-.7-.7-1.1z" />
                    <path d="M8 3.8c-1.1 0-2.1.4-2.8 1.1C4.1 5.7 3.5 7 3.5 8.6c0 2.6 2 4.7 4.5 4.7s4.5-2.1 4.5-4.7c0-1.6-.6-2.9-1.7-3.7C9.9 4.2 9 3.8 8 3.8z" />
                    <path d="M8 3.8c.9 1.4 2.4 2.3 4.1 2.4-.3-1.6-1.3-3-2.7-3.7C8.9 2.7 8.4 3.2 8 3.8z" opacity=".35" />
                  </svg>
                  <span className="truncate">Peaches</span>
                </span>
                <span>R6</span>
              </div>
              <div className="relative flex-1 min-h-0 rounded-[12px] overflow-hidden mt-1 bg-black/5">
                <img
                  src="/Peach1.jpg"
                  alt="Peaches"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 inset-x-1 flex justify-center">
                  <span className="px-1.5 py-0.5 rounded-full bg-[#d92d20] type-caption pill-on-dark whitespace-nowrap">
                    88.5% chlorosis
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <FieldArrayTelemetry
              tiltStatus={tiltStatus}
              waterTelemetry={waterTelemetry}
              zones={zones}
              onTriggerWatering={onTriggerWatering}
              onToggleSnooze={onToggleSnooze}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
