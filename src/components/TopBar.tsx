import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sun, 
  ChevronDown, 
  Zap, 
  Sprout, 
  ShieldCheck, 
  Monitor, 
  Tablet, 
  Download, 
  Wind,
  Check
} from 'lucide-react';
import { AgriPvSite, PriorityMode } from '../types';

interface TopBarProps {
  sites: AgriPvSite[];
  selectedSite: AgriPvSite;
  onSelectSite: (site: AgriPvSite) => void;
  priorityMode: PriorityMode;
  onChangePriorityMode: (mode: PriorityMode) => void;
  isTabletFrame: boolean;
  onToggleTabletFrame: () => void;
  onExportData: () => void;
  onBackToOverview: () => void;
  activeTab: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  sites,
  selectedSite,
  onSelectSite,
  priorityMode,
  onChangePriorityMode,
  isTabletFrame,
  onToggleTabletFrame,
  onExportData,
  onBackToOverview,
  activeTab,
}) => {
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const siteRef = useRef<HTMLDivElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (siteRef.current && !siteRef.current.contains(e.target as Node)) {
        setSiteDropdownOpen(false);
      }
      if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) {
        setPriorityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const priorityMeta = {
    'crop-weighted': {
      label: 'Crop-Weighted Priority',
      badge: 'Canopy Microclimate Shield',
      icon: Sprout,
      color: 'bg-[#d3d0c9]/70 hover:bg-white text-[#211d19] border-white/60',
      description: 'Tilts panels to deliver optimal PAR and shadow curtains to avert sunburn and conserve soil moisture.',
    },
    'energy-weighted': {
      label: 'Energy-Weighted Priority',
      badge: 'Peak Solar Export',
      icon: Zap,
      color: 'bg-[#d3d0c9]/70 hover:bg-white text-[#211d19] border-white/60',
      description: 'Maximizes solar irradiance perpendicularity during high spot price grid export windows.',
    },
    'recovery mode': {
      label: 'Recovery Mode',
      badge: 'Soil Rehydration & Aeration',
      icon: ShieldCheck,
      color: 'bg-[#d3d0c9]/70 hover:bg-white text-[#211d19] border-white/60',
      description: 'Stows panels flat or at high tilt for deep irrigation absorption, fungal spore UV suppression, or soil healing.',
    },
  };

  const currentPriority = priorityMeta[priorityMode];
  const PriorityIcon = currentPriority.icon;

  return (
    <header 
      id="agripv-topbar"
      className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-[#211d19]/8 bg-[#e8e6e1] shrink-0"
    >
      {/* Left Area: Back Button, Site Selector, and Title */}
      <div className="flex items-center gap-3">
        {activeTab !== 'dashboard' && (
          <button
            id="back-nav-btn"
            onClick={onBackToOverview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full type-body hover:bg-black/5 transition-all cursor-pointer border border-[#211d19]/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
        )}

        {activeTab !== 'dashboard' && (
          <div className="hidden sm:block type-card-title type-ink capitalize">
            {activeTab === 'solar'
              ? 'Solar'
              : activeTab === 'agriculture'
                ? 'Agriculture'
                : activeTab === 'settings'
                  ? 'Settings'
                  : activeTab}
          </div>
        )}

        {/* Site Selector Dropdown */}
        <div className="relative" ref={siteRef}>
          <button
            id="site-selector-dropdown-btn"
            onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#d3d0c9]/70 hover:bg-white border border-white/60 shadow-xs transition-all cursor-pointer group text-left"
          >
            <div className="w-6 h-6 rounded-lg bg-[#1c1917] flex items-center justify-center text-white shrink-0">
              <Sun className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="type-micro leading-none">AgriPV parcel</div>
              <div className="type-body flex items-center gap-1 mt-0.5">
                <span className="truncate max-w-[170px] sm:max-w-[220px]">{selectedSite.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#797166] group-hover:text-black transition-transform" />
              </div>
            </div>
          </button>

          {siteDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-[#211d19]/10 p-2 z-50">
              <div className="px-3 py-1.5 type-micro">
                Select Agrivoltaics Facility
              </div>
              {sites.map((site) => (
                <button
                  key={site.id}
                  onClick={() => {
                    onSelectSite(site);
                    setSiteDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                    site.id === selectedSite.id 
                      ? 'bg-[#1c1917] text-white font-normal' 
                      : 'hover:bg-black/5 text-[#211d19] font-normal'
                  }`}
                >
                  <div>
                    <div className="font-normal">{site.name}</div>
                    <div className={`type-caption ${site.id === selectedSite.id ? 'text-white/60' : 'text-[#797166]'}`}>
                      {site.location} · {site.installedPVPowermWp} MWp
                    </div>
                  </div>
                  {site.id === selectedSite.id && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center/Right Area: Priority Mode Selector and Environment Badges */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Priority Mode Selector Dropdown */}
        <div className="relative" ref={priorityRef}>
          <button
            id="priority-mode-btn"
            onClick={() => setPriorityDropdownOpen(!priorityDropdownOpen)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border shadow-xs transition-all cursor-pointer ${currentPriority.color}`}
          >
            <PriorityIcon className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <div className="type-micro">Operational mode</div>
              <div className="type-body leading-none flex items-center gap-1.5 mt-0.5">
                <span>{currentPriority.label}</span>
                <ChevronDown className="w-3 h-3 text-[#797166]" />
              </div>
            </div>
          </button>

          {priorityDropdownOpen && (
            <div className="absolute right-0 sm:left-0 mt-2 w-80 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-[#211d19]/10 p-2 z-50">
              <div className="px-3 py-1.5 type-micro">
                AgriPV Dual-Yield Optimization Mode
              </div>
              {(['crop-weighted', 'energy-weighted', 'recovery mode'] as PriorityMode[]).map((mode) => {
                const meta = priorityMeta[mode];
                const Icon = meta.icon;
                const isCurrent = priorityMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => {
                      onChangePriorityMode(mode);
                      setPriorityDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer mb-1 ${
                      isCurrent
                        ? 'bg-[#1c1917] text-white'
                        : 'hover:bg-black/5 text-[#211d19]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-normal">
                        <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-[#211d19]'}`} />
                        <span>{meta.label}</span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <p className={`type-caption leading-snug ${isCurrent ? 'text-white/60' : 'text-[#797166]'}`}>
                      {meta.description}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Weather & Irradiance Chip */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#d3d0c9]/60 border border-white/50 text-xs text-[#211d19] shadow-xs">
          <div className="flex items-center gap-1 font-normal">
            <Sun className="w-3.5 h-3.5 text-[#211d19]" />
            <span>860 W/m² GHI</span>
          </div>
          <span className="w-px h-3 bg-[#211d19]/10" />
          <div className="flex items-center gap-1 font-normal text-[#797166]">
            <Wind className="w-3.5 h-3.5 text-[#797166]" />
            <span>4.8 m/s (Wind Safe)</span>
          </div>
        </div>

        {/* Quick Data Export Button */}
        <button
          id="topbar-export-btn"
          onClick={onExportData}
          title="Export CSV Telemetry & Energy Data"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d3d0c9]/70 hover:bg-white border border-white/60 type-body shadow-xs transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>

        {/* Tablet Frame Toggle Button */}
        <button
          id="tablet-frame-toggle-btn"
          onClick={onToggleTabletFrame}
          title={isTabletFrame ? 'Switch to Full Screen View' : 'Preview in Rugged Tablet Frame'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d3d0c9]/70 hover:bg-white border border-white/60 type-body shadow-xs transition-all cursor-pointer"
        >
          {isTabletFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-[#211d19]" />
              <span className="hidden sm:inline">Full Fluid</span>
            </>
          ) : (
            <>
              <Tablet className="w-3.5 h-3.5 text-[#211d19]" />
              <span className="hidden sm:inline">Tablet Frame</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
