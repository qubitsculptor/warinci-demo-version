import React, { useMemo, useState } from 'react';
import { 
  Layers, 
  Droplet, 
  Sun, 
  Compass, 
  AlertTriangle, 
  Play, 
  Pause, 
  Sparkles, 
  Activity, 
  Maximize2,
  ShieldCheck,
  Thermometer,
  Camera,
  ChevronDown,
  Check,
} from 'lucide-react';
import { PanelTiltStatus, WaterTelemetry, ZoneMicroclimate } from '../types';

export type FieldArrayLayer = 'pv_trackers' | 'ndvi' | 'moisture' | 'live_crop' | 'satellite';

interface FieldArrayTelemetryProps {
  tiltStatus: PanelTiltStatus;
  waterTelemetry: WaterTelemetry;
  zones: ZoneMicroclimate[];
  onTriggerWatering: () => void;
  onToggleSnooze: () => void;
  onOpenCvModal?: () => void;
}

export const FieldArrayTelemetry: React.FC<FieldArrayTelemetryProps> = ({
  tiltStatus,
  waterTelemetry,
  zones,
  onTriggerWatering,
  onToggleSnooze,
  onOpenCvModal
}) => {
  const [activeLayer, setActiveLayer] = useState<FieldArrayLayer>('live_crop');
  const [selectedRow, setSelectedRow] = useState<number>(8);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [liveCropOpen, setLiveCropOpen] = useState(false);
  const [selectedLiveCropId, setSelectedLiveCropId] = useState('cv-1');

  const liveCropFeeds = useMemo(() => {
    const z1 = zones[0];
    const z2 = zones[1];
    const z3 = zones[2];
    return [
      {
        id: 'cv-1',
        label: 'Apples · R14',
        crop: 'Apples',
        zone: 'Block 1 · Sector 4B · Row 14',
        imageUrl: '/apple1.jpg',
        badge: '94.8% mildew',
        badgeTone: 'alert' as const,
        timestamp: 'Live · 13:42',
        stage: z1?.cropStage ?? 'Fruit Sizing (Stage 4/6)',
        health: 'Stressed',
        healthTone: 'alert' as const,
        canopyC: z1?.temperature.current ?? 27.8,
        moisture: z1?.soilMoisture.current ?? 26.7,
        par: z1?.lightLevelPAR.current ?? 780,
        ndvi: 0.48,
        note: 'Powdery mildew on juvenile leaf clusters under dripline',
      },
      {
        id: 'cv-2',
        label: 'Cherries · R28',
        crop: 'Cherries',
        zone: 'Block 2 · Perimeter Row 28',
        imageUrl: '/cherry1.jpg',
        badge: '91.2% moth',
        badgeTone: 'alert' as const,
        timestamp: 'Live · 11:15',
        stage: z2?.cropStage ?? 'Pre-Harvest Color Break (Stage 5/6)',
        health: 'At risk',
        healthTone: 'alert' as const,
        canopyC: z2?.temperature.current ?? 28.4,
        moisture: z2?.soilMoisture.current ?? 34.2,
        par: z2?.lightLevelPAR.current ?? 820,
        ndvi: 0.71,
        note: 'Codling moth flight events · early egg deposit flagged',
      },
      {
        id: 'cv-3',
        label: 'Peaches · R6',
        crop: 'Peaches',
        zone: 'Block 3 · West Terrace Row 6',
        imageUrl: '/Peach1.jpg',
        badge: '88.5% chlorosis',
        badgeTone: 'warn' as const,
        timestamp: 'Live · Yesterday',
        stage: z3?.cropStage ?? 'Fruit Maturation & Sugar Accumulation',
        health: 'Watch',
        healthTone: 'warn' as const,
        canopyC: z3?.temperature.current ?? 29.2,
        moisture: z3?.soilMoisture.current ?? 38.5,
        par: z3?.lightLevelPAR.current ?? 890,
        ndvi: 0.74,
        note: 'Interveinal iron chlorosis · alkaline lime subsoil',
      },
      {
        id: 'zone-honeycrisp',
        label: 'Honeycrisp · Canopy',
        crop: 'Honeycrisp Apples',
        zone: z1?.zoneName ?? 'Block 1 · Apple Orchard',
        imageUrl: '/apple1.jpg',
        badge: 'Healthy',
        badgeTone: 'ok' as const,
        timestamp: 'Live · now',
        stage: z1?.cropStage ?? 'Fruit Sizing (Stage 4/6)',
        health: 'Optimal',
        healthTone: 'ok' as const,
        canopyC: z1?.temperature.current ?? 27.8,
        moisture: 34.0,
        par: z1?.lightLevelPAR.current ?? 780,
        ndvi: 0.84,
        note: `Shade ${z1?.shadingPercentage ?? 38}% · water save ${z1?.waterSavingsVsBaselinePercent ?? 31.4}%`,
      },
      {
        id: 'zone-rainier',
        label: 'Rainier · Rows 13–15',
        crop: 'Rainier Cherries',
        zone: z2?.zoneName ?? 'Block 2 · Cherry Rows',
        imageUrl: '/cherry1.jpg',
        badge: 'Nominal',
        badgeTone: 'ok' as const,
        timestamp: 'Live · now',
        stage: z2?.cropStage ?? 'Pre-Harvest Color Break (Stage 5/6)',
        health: 'Optimal',
        healthTone: 'ok' as const,
        canopyC: z2?.temperature.current ?? 28.4,
        moisture: z2?.soilMoisture.current ?? 34.2,
        par: z2?.lightLevelPAR.current ?? 820,
        ndvi: 0.85,
        note: `Shade ${z2?.shadingPercentage ?? 32}% · water save ${z2?.waterSavingsVsBaselinePercent ?? 28.7}%`,
      },
    ];
  }, [zones]);

  const activeLiveCrop =
    liveCropFeeds.find((f) => f.id === selectedLiveCropId) ?? liveCropFeeds[0];

  const trackerRows = [
    { id: 1, name: 'R1', crop: 'Honeycrisp', kw: 28.4, status: 'nominal', ndvi: 0.82, moisture: 34.2 },
    { id: 2, name: 'R2', crop: 'Honeycrisp', kw: 28.1, status: 'nominal', ndvi: 0.81, moisture: 33.8 },
    { id: 3, name: 'R3', crop: 'Honeycrisp', kw: 27.9, status: 'nominal', ndvi: 0.80, moisture: 32.5 },
    { id: 4, name: 'R4', crop: 'Honeycrisp', kw: 28.3, status: 'nominal', ndvi: 0.83, moisture: 34.0 },
    { id: 5, name: 'R5', crop: 'Honeycrisp', kw: 28.0, status: 'nominal', ndvi: 0.82, moisture: 33.1 },
    { id: 6, name: 'R6', crop: 'Honeycrisp', kw: 28.2, status: 'nominal', ndvi: 0.84, moisture: 34.5 },
    { id: 7, name: 'R7', crop: 'Honeycrisp', kw: 27.8, status: 'nominal', ndvi: 0.79, moisture: 31.2 },
    { id: 8, name: 'R8', crop: '4B stress', kw: 26.2, status: 'stressed', ndvi: 0.48, moisture: 26.7 },
    { id: 9, name: 'R9', crop: 'Honeycrisp', kw: 28.3, status: 'nominal', ndvi: 0.81, moisture: 33.6 },
    { id: 10, name: 'R10', crop: 'Honeycrisp', kw: 28.5, status: 'nominal', ndvi: 0.82, moisture: 34.1 },
    { id: 11, name: 'R11', crop: 'Honeycrisp', kw: 28.2, status: 'nominal', ndvi: 0.80, moisture: 33.0 },
    { id: 12, name: 'R12', crop: 'Honeycrisp', kw: 28.0, status: 'nominal', ndvi: 0.81, moisture: 32.9 },
    { id: 13, name: 'R13', crop: 'Rainier', kw: 27.7, status: 'nominal', ndvi: 0.85, moisture: 35.2 },
    { id: 14, name: 'R14', crop: 'Rainier', kw: 27.9, status: 'nominal', ndvi: 0.83, moisture: 34.8 },
    { id: 15, name: 'R15', crop: 'Rainier', kw: 28.1, status: 'nominal', ndvi: 0.84, moisture: 35.0 },
    { id: 16, name: 'R16', crop: 'Elberta', kw: 28.4, status: 'nominal', ndvi: 0.86, moisture: 36.1 },
    { id: 17, name: 'R17', crop: 'Elberta', kw: 28.2, status: 'nominal', ndvi: 0.85, moisture: 35.7 },
    { id: 18, name: 'R18', crop: 'Elberta', kw: 28.3, status: 'nominal', ndvi: 0.87, moisture: 36.4 },
  ];

  return (
    <div 
      id="field-array-telemetry-container"
      className={`relative w-full h-full min-h-0 rounded-[24px] overflow-hidden border border-white/50 flex flex-col justify-between p-2.5 sm:p-3 type-ink select-none transition-all duration-300 ${
        activeLayer === 'satellite' ? 'bg-[#1c1917]' : 'bg-[#dcdad4]'
      }`}
      style={
        activeLayer === 'satellite'
          ? {
              backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      <div className="relative z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 shrink-0">
        <div className="flex items-center gap-1 p-0.5 bg-[#d3d0c9]/80 rounded-2xl border border-white/40 overflow-x-auto">
          {[
            { id: 'live_crop', label: 'Live crop', icon: Camera },
            { id: 'pv_trackers', label: 'Trackers', icon: Sun },
            { id: 'ndvi', label: 'NDVI', icon: Layers },
            { id: 'moisture', label: 'Soil', icon: Droplet },
          ].map((layer) => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => {
                  setActiveLayer(layer.id as FieldArrayLayer);
                  setLiveCropOpen(false);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-xl type-caption transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1c1917] pill-on-dark shadow-sm'
                    : 'type-ink hover:bg-white/60'
                }`}
              >
                <Icon
                  className="w-3 h-3"
                  fill={isActive && layer.id !== 'live_crop' ? 'currentColor' : 'none'}
                  strokeWidth={isActive ? 1.25 : 2}
                />
                <span>{layer.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-1.5">
          {activeLayer === 'live_crop' ? (
            <div className="relative">
              <button
                onClick={() => setLiveCropOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#d3d0c9] border border-[#211d19]/15 type-caption type-ink hover:bg-[#cfcbc3] transition-colors cursor-pointer max-w-[11rem]"
              >
                <Camera className="w-3 h-3 text-[#211d19] shrink-0" />
                <span className="truncate">{activeLiveCrop.label}</span>
                <ChevronDown className="w-3 h-3 type-muted shrink-0" />
              </button>

              {liveCropOpen && (
                <div className="absolute right-0 mt-1.5 w-64 rounded-2xl bg-[#ffffff]/95 backdrop-blur-md border border-[#211d19]/10 shadow-xl p-1.5 z-50">
                  <div className="px-2.5 py-1 type-micro">Select zone / crop</div>
                  {liveCropFeeds.map((feed) => (
                    <button
                      key={feed.id}
                      onClick={() => {
                        setSelectedLiveCropId(feed.id);
                        setLiveCropOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl type-caption transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                        selectedLiveCropId === feed.id
                          ? 'bg-[#1c1917] pill-on-dark'
                          : 'type-ink hover:bg-black/5'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-normal">{feed.label}</span>
                        <span
                          className={`block truncate mt-0.5 ${
                            selectedLiveCropId === feed.id ? 'text-white/60' : 'type-muted'
                          }`}
                        >
                          {feed.zone}
                        </span>
                      </span>
                      {selectedLiveCropId === feed.id && (
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[#d3d0c9]/80 border border-white/40 type-caption type-ink">
              <Compass className="w-3 h-3 type-muted" />
              <span className="font-normal">
                Tilt {tiltStatus.currentAngle > 0 ? `+${tiltStatus.currentAngle.toFixed(1)}°` : `${tiltStatus.currentAngle.toFixed(1)}°`}
              </span>
            </div>
          )}

          <button 
            onClick={() => setActiveLayer(activeLayer === 'satellite' ? 'pv_trackers' : 'satellite')}
            title="Toggle Satellite Orthophoto"
            className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
              activeLayer === 'satellite'
                ? 'bg-[#1c1917] text-white border-transparent'
                : 'bg-[#d3d0c9]/80 hover:bg-[#d3d0c9] type-muted border-white/40'
            }`}
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="relative my-auto py-1 z-20 flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
        {activeLayer === 'pv_trackers' && (
          <div className="w-full h-full min-h-0 flex flex-col gap-1.5">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 flex-1 min-h-0 content-stretch">
              {trackerRows.map((row) => {
                const isSelected = selectedRow === row.id;
                const isStressed = row.status === 'stressed';

                return (
                  <div
                    key={row.id}
                    onClick={() => {
                      setSelectedRow(row.id);
                      if (isStressed) setShowTooltip(true);
                    }}
                    className={`relative rounded-lg p-1.5 flex flex-col justify-between min-h-0 transition-all cursor-pointer border ${
                      isStressed
                        ? 'bg-[#f04438]/12 border-[#f04438]/50'
                        : isSelected
                        ? 'bg-white/70 border-[#211d19]/25'
                        : 'bg-[#d3d0c9]/65 border-white/40 hover:border-[#211d19]/20 hover:bg-[#d3d0c9]'
                    }`}
                  >
                    <div className="flex items-center justify-between type-caption tabular-nums type-muted">
                      <span className="type-ink">{row.name}</span>
                      {isStressed ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f04438]" />
                      ) : (
                        <span>{row.kw}</span>
                      )}
                    </div>

                    <div className="my-auto relative h-1 w-full bg-[#211d19]/10 rounded-full overflow-hidden flex items-center justify-center">
                      <div 
                        className={`h-1 w-full rounded-full transition-transform duration-500 ${
                          isStressed ? 'bg-[#f04438]' : 'bg-[#211d19]/55'
                        }`}
                        style={{ transform: `rotate(${tiltStatus.currentAngle * 0.35}deg)` }}
                      />
                    </div>

                    <div className="type-caption text-center type-muted">
                      {row.crop}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedRow === 8 && showTooltip && (
              <div className="relative rounded-xl bg-white/70 border border-[#f04438]/25 px-2.5 py-2 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#f04438] shrink-0" />
                  <div className="min-w-0">
                    <div className="type-body">Sector 4B deficit</div>
                    <div className="type-caption">
                      Moisture {waterTelemetry.moisturePercent.toFixed(1)}% · thresh 28%
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowTooltip(false)}
                  className="type-muted hover:text-[#211d19] type-caption px-1 cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        {activeLayer === 'ndvi' && (
          <div className="w-full space-y-3 p-1">
            <div className="relative rounded-2xl overflow-hidden bg-[#d3d0c9]/65 p-3 border border-white/40">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-1.5 font-normal type-ink">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Sentinel-2 NDVI Canopy Index</span>
                </div>
                <span className="type-caption bg-[#b4f53c] border border-[#b4f53c] pill-on-light px-2 py-0.5 rounded-md">
                  Average 0.81 (Optimal Vigour)
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 my-2 text-center">
                <div className="bg-[#b4f53c]/15 border border-[#b4f53c]/35 rounded-xl p-2">
                  <div className="text-base font-normal type-ink tabular-nums">0.84</div>
                  <div className="type-caption type-muted">Honeycrisp</div>
                  <div className="type-caption type-ink mt-0.5">High Vigour</div>
                </div>
                <div className="bg-[#facc15]/15 border border-[#facc15]/40 rounded-xl p-2">
                  <div className="text-base font-normal type-ink tabular-nums">0.48</div>
                  <div className="type-caption type-muted">Sector 4B</div>
                  <div className="type-caption type-ink mt-0.5">Moisture Stress</div>
                </div>
                <div className="bg-[#b4f53c]/15 border border-[#b4f53c]/35 rounded-xl p-2">
                  <div className="text-base font-normal type-ink tabular-nums">0.83</div>
                  <div className="type-caption type-muted">Cherries</div>
                  <div className="type-caption type-ink mt-0.5">Dense Canopy</div>
                </div>
                <div className="bg-[#b4f53c]/15 border border-[#b4f53c]/35 rounded-xl p-2">
                  <div className="text-base font-normal type-ink tabular-nums">0.86</div>
                  <div className="type-caption type-muted">Peaches</div>
                  <div className="type-caption type-ink mt-0.5">Lush Biomass</div>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#211d19]/10 grid grid-cols-3 gap-2 type-caption">
                <div className="flex items-center gap-1 type-muted">
                  <Thermometer className="w-3.5 h-3.5 type-ink" />
                  <span>Canopy: -3.2°C Cooler</span>
                </div>
                <div className="flex items-center gap-1 type-muted">
                  <Sun className="w-3.5 h-3.5 type-ink" />
                  <span>PAR Light: 780 µmol/m²</span>
                </div>
                <div className="flex items-center gap-1 type-muted">
                  <ShieldCheck className="w-3.5 h-3.5 type-ink" />
                  <span>Sunburn: -94% Damage</span>
                </div>
              </div>
            </div>

            <div className="px-1">
              <div className="flex items-center justify-between type-caption mb-1 type-ink">
                <span>0.0 Bare / Stressed</span>
                <span>0.5 Moderate</span>
                <span>1.0 Peak Photosynthesis</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#ff4d1a] via-[#ffe600] to-[#b4f53c]" />
            </div>
          </div>
        )}

        {activeLayer === 'moisture' && (
          <div className="w-full space-y-3 p-1">
            <div className="rounded-2xl bg-[#d3d0c9]/65 p-3.5 border border-white/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1c1917] text-white flex items-center justify-center">
                    <Droplet className="w-4 h-4" fill="currentColor" strokeWidth={1.25} />
                  </div>
                  <div>
                    <div className="type-body">Tri-Depth Soil Matrix Telemetry</div>
                    <div className="type-caption">Under-Tracker Dripline #14 Probes</div>
                  </div>
                </div>
                <span className="type-caption">
                  LoRaWAN Active
                </span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="type-muted font-normal">10 cm Surface Profile (Direct Sun Boundary)</span>
                    <span className="tabular-nums font-normal type-ink">22.0% RH · Dry</span>
                  </div>
                  <div className="h-2 w-full bg-[#211d19]/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#f04438] rounded-full" style={{ width: '22%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="type-muted font-normal">30 cm Primary Root Zone (Honeycrisp Taproots)</span>
                    <span className="tabular-nums font-normal type-ink">{waterTelemetry.moisturePercent.toFixed(1)}% RH · Deficit</span>
                  </div>
                  <div className="h-2 w-full bg-[#211d19]/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#facc15] rounded-full" style={{ width: `${waterTelemetry.moisturePercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="type-muted font-normal">60 cm Deep Bed Subsoil (Water Table Reserve)</span>
                    <span className="tabular-nums font-normal type-ink">36.4% RH · Adequate</span>
                  </div>
                  <div className="h-2 w-full bg-[#211d19]/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#b4f53c] rounded-full" style={{ width: '56%' }} />
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#211d19]/10 flex items-center justify-between type-caption type-muted">
                <span className="flex items-center gap-1 type-ink font-normal">
                  <Sparkles className="w-3 h-3" /> +31.4% Soil Moisture Retention
                </span>
                <span>Evaporation Shield: Active</span>
              </div>
            </div>
          </div>
        )}

        {activeLayer === 'live_crop' && (
          <div className="w-full h-full min-h-0 flex flex-col">
            <div
              className="relative flex-1 min-h-0 rounded-2xl overflow-hidden border border-white/50 bg-[#d3d0c9] cursor-pointer"
              onClick={onOpenCvModal}
              title="Inspect live crop frame"
            >
              <img
                key={activeLiveCrop.id}
                src={activeLiveCrop.imageUrl}
                alt={`${activeLiveCrop.crop} live feed`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25 pointer-events-none" />

              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-white/20 type-caption pill-on-dark">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f04438] animate-pulse" />
                  {activeLiveCrop.timestamp}
                </div>
                <span
                  className={`px-2 py-1 rounded-lg type-caption border backdrop-blur-sm ${
                    activeLiveCrop.badgeTone === 'ok'
                      ? 'bg-[#b4f53c] border-[#b4f53c] pill-on-light'
                      : activeLiveCrop.badgeTone === 'warn'
                      ? 'bg-[#facc15] border-[#facc15] pill-on-light'
                      : 'bg-[#d92d20] border-[#d92d20] pill-on-dark'
                  }`}
                >
                  {activeLiveCrop.badge}
                </span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <div className="type-card-title text-white drop-shadow-sm" style={{ color: '#fff' }}>{activeLiveCrop.crop}</div>
                <div className="type-caption mt-0.5 truncate text-white/85" style={{ color: 'rgba(255,255,255,0.85)' }}>{activeLiveCrop.zone}</div>
              </div>
            </div>
          </div>
        )}

        {activeLayer === 'satellite' && (
          <div className="relative my-auto flex items-center justify-center">
            <svg viewBox="0 0 300 240" className="w-68 sm:w-76 drop-shadow-2xl">
              <defs>
                <linearGradient id="satNdviPoly" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff4d1a" />
                  <stop offset="35%" stopColor="#ffe600" />
                  <stop offset="65%" stopColor="#b4f53c" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
              </defs>
              <polygon 
                points="30,130 90,60 270,110 210,210 150,180 140,200 60,150"
                fill="url(#satNdviPoly)"
                fillOpacity="0.88"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <line x1="70" y1="95" x2="230" y2="140" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.8" />
              <line x1="85" y1="115" x2="215" y2="155" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.8" />
              <line x1="100" y1="135" x2="200" y2="170" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.8" />
            </svg>
          </div>
        )}
      </div>

      <div 
        id="docked-context-panel"
        className="relative z-30 w-full bg-[#d3d0c9]/80 border border-white/50 rounded-[16px] p-2.5 shrink-0"
      >
        {activeLayer === 'live_crop' && (
          <>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="min-w-0">
                <div className="type-micro">Crop health</div>
                <div className="type-body truncate">{activeLiveCrop.stage}</div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full type-caption shrink-0 border ${
                  activeLiveCrop.healthTone === 'ok'
                    ? 'bg-[#b4f53c] border-[#b4f53c] pill-on-light'
                    : activeLiveCrop.healthTone === 'warn'
                    ? 'bg-[#facc15] border-[#facc15] pill-on-light'
                    : 'bg-[#d92d20] border-[#d92d20] pill-on-dark'
                }`}
              >
                {activeLiveCrop.health}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 my-1.5">
              {[
                { label: 'Canopy', value: `${activeLiveCrop.canopyC}°C` },
                { label: 'Moisture', value: `${activeLiveCrop.moisture}%` },
                { label: 'PAR', value: `${activeLiveCrop.par}` },
                { label: 'NDVI', value: activeLiveCrop.ndvi.toFixed(2) },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl bg-white/50 border border-white/50 px-2 py-1.5 text-center"
                >
                  <div className="type-micro opacity-80">{m.label}</div>
                  <div className="type-card-title tabular-nums mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>

            <div className="type-caption opacity-90 truncate pt-0.5 border-t border-[#211d19]/10">
              {activeLiveCrop.note}
            </div>
          </>
        )}

        {activeLayer === 'pv_trackers' && (
          <>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="min-w-0">
                <div className="type-micro">Tracker array</div>
                <div className="type-body truncate">{tiltStatus.trackerHealth}</div>
              </div>
              <span className="px-2 py-0.5 rounded-full type-caption shrink-0 bg-[#1c1917] pill-on-dark">
                {tiltStatus.mode.split(' ')[0]}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 my-1.5">
              {[
                {
                  label: 'Current',
                  value: `${tiltStatus.currentAngle > 0 ? '+' : ''}${tiltStatus.currentAngle.toFixed(1)}°`,
                },
                {
                  label: 'Target',
                  value: `${tiltStatus.targetAngle > 0 ? '+' : ''}${tiltStatus.targetAngle.toFixed(1)}°`,
                },
                {
                  label: 'Wind',
                  value: `${tiltStatus.windSpeedMs.toFixed(1)} m/s`,
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl bg-white/50 border border-white/50 px-2 py-1.5 text-center"
                >
                  <div className="type-micro opacity-80">{m.label}</div>
                  <div className="type-card-title tabular-nums mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>

            <div className="type-caption opacity-90 truncate pt-0.5 border-t border-[#211d19]/10">
              Mode · {tiltStatus.mode}
              {tiltStatus.isStowActive ? ' · Stow active' : ''}
            </div>
          </>
        )}

        {activeLayer === 'ndvi' && (
          <>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="min-w-0">
                <div className="type-micro">Canopy NDVI</div>
                <div className="type-body truncate">Sentinel-2 vigour index</div>
              </div>
              <span className="px-2 py-0.5 rounded-full type-caption shrink-0 bg-[#b4f53c] border border-[#b4f53c] pill-on-light">
                Avg 0.81
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 my-1.5">
              {[
                { label: 'Honeycrisp', value: '0.84', tone: 'ok' },
                { label: 'Sector 4B', value: '0.48', tone: 'alert' },
                { label: 'Cherries', value: '0.83', tone: 'ok' },
                { label: 'Peaches', value: '0.86', tone: 'ok' },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl bg-white/50 border border-white/50 px-2 py-1.5 text-center"
                >
                  <div className="type-micro opacity-80 truncate">{m.label}</div>
                  <div className="type-card-title tabular-nums mt-0.5 type-ink">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-0.5 border-t border-[#211d19]/10">
              <div className="flex items-center justify-between type-caption mb-1 opacity-90">
                <span>Stressed</span>
                <span>Peak vigour</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#ff4d1a] via-[#ffe600] to-[#b4f53c]" />
            </div>
          </>
        )}

        {activeLayer === 'moisture' && (
          <>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-[#1c1917] text-white flex items-center justify-center shrink-0">
                  <Droplet className="w-3.5 h-3.5" fill="currentColor" strokeWidth={1.25} />
                </div>
                <div className="min-w-0">
                  <div className="type-micro">Micro-drip</div>
                  <div className="type-body truncate">Dripline #14</div>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded-full type-caption shrink-0 ${
                waterTelemetry.moisturePercent < 28 && !waterTelemetry.isWateringActive
                  ? 'bg-[#d92d20] pill-on-dark'
                  : 'bg-white/70 border border-white/60 type-ink'
              }`}>
                {waterTelemetry.isWateringActive
                  ? 'Pulse active'
                  : waterTelemetry.moisturePercent < 28
                  ? 'Deficit'
                  : 'Normal'}
              </span>
            </div>

            <div className="my-1.5">
              <div className="flex items-center justify-between type-caption mb-1">
                <span>Depth 10 · 30 · 60 cm</span>
                <span className="tabular-nums type-ink">{waterTelemetry.moisturePercent.toFixed(1)}%</span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <div className="h-1 rounded-full bg-[#ff4d1a]" title="10cm Surface: 22%" />
                <div className="h-1 rounded-full bg-[#ffe600]" title="30cm Root Zone: 26.7%" />
                <div className="h-1 rounded-full bg-[#b4f53c]" title="60cm Deep Bed: 36.4%" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 mt-1.5 pt-1.5 border-t border-[#211d19]/10">
              <div className="type-caption">
                Flow <span className="tabular-nums type-ink">{waterTelemetry.isWateringActive ? '48.2' : '0.0'} L/min</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={onToggleSnooze}
                  className={`px-2.5 py-1 rounded-lg type-caption transition-all cursor-pointer border ${
                    waterTelemetry.isSnoozed 
                      ? 'bg-[#1c1917] text-white border-transparent' 
                      : 'bg-white/50 hover:bg-white/80 type-muted border-white/60'
                  }`}
                >
                  {waterTelemetry.isSnoozed ? 'Snoozed' : 'Snooze'}
                </button>

                <button
                  onClick={onTriggerWatering}
                  disabled={waterTelemetry.isWateringActive}
                  className={`px-2.5 py-1 rounded-lg type-caption transition-all cursor-pointer flex items-center gap-1 shadow-sm ${
                    waterTelemetry.isWateringActive
                      ? 'bg-[#1c1917] text-white cursor-not-allowed'
                      : 'bg-[#b4f53c] hover:bg-[#a3e635] text-black active:scale-95'
                  }`}
                >
                  {waterTelemetry.isWateringActive ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pulsing (35m)...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>+ Water Pulse</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {activeLayer === 'satellite' && (
          <>
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="min-w-0">
                <div className="type-micro">Orthophoto</div>
                <div className="type-body truncate">Field mosaic · NDVI overlay</div>
              </div>
              <span className="px-2 py-0.5 rounded-full type-caption shrink-0 bg-[#1c1917] pill-on-dark">
                Live tile
              </span>
            </div>
            <div className="type-caption opacity-90">
              Tap maximize again to return to Live crop or Trackers
            </div>
          </>
        )}
      </div>
    </div>
  );
};
