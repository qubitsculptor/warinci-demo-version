import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  AgriPvSite,
  AutonomousRecommendation,
  CvDetectedIssue,
  FarmAlert,
  SeasonComparison,
  ZoneMicroclimate,
} from '../types';

type AgriSection = 'overview' | 'zones' | 'schedule' | 'alerts' | 'trends';

interface AgricultureViewProps {
  site: AgriPvSite;
  zones: ZoneMicroclimate[];
  cvIssues: CvDetectedIssue[];
  recommendations: AutonomousRecommendation[];
  alerts: FarmAlert[];
  comparisons: SeasonComparison[];
  onSelectCvIssue: (issue: CvDetectedIssue) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onAcknowledgeAlert: (id: string) => void;
  onResolveAlert: (id: string) => void;
  initialSection?: AgriSection;
}

const SECTIONS: { id: AgriSection; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'zones', label: 'Zones' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'trends', label: 'Trends' },
];

const CROPS = [
  { name: 'Apples', pct: '38.5%', ha: '14.5 Ha', issueIdx: 0, row: 'R14', img: '/apple1.jpg', badge: '94.8% mildew' },
  { name: 'Cherries', pct: '32.3%', ha: '13.5 Ha', issueIdx: 1, row: 'R28', img: '/cherry.jpeg', badge: '91.2% moth' },
  { name: 'Peaches', pct: '29.2%', ha: '18.5 Ha', issueIdx: 2, row: 'R6', img: '/Peach1.jpg', badge: '88.5% chlorosis' },
];

const TREND_CHART = [
  { label: 'Yield', agri: 82, open: 72 },
  { label: 'Water', agri: 68, open: 100 },
  { label: 'Grade', agri: 89, open: 61 },
  { label: 'Sunburn', agri: 6, open: 42 },
  { label: 'LER', agri: 88, open: 50 },
];

function statusPill(status: string) {
  const isCritical = status === 'critical';
  const isWarning = status === 'warning';
  return (
    <span
      className={`px-2 py-0.5 rounded-full type-caption border shrink-0 ${
        isCritical
          ? 'bg-[#d92d20] border-[#d92d20] pill-on-dark'
          : isWarning
            ? 'bg-[#facc15] border-[#facc15] pill-on-light'
            : 'bg-[#b4f53c] border-[#b4f53c] pill-on-light'
      }`}
    >
      {status === 'optimal' ? 'Optimal' : status}
    </span>
  );
}

export const AgricultureView: React.FC<AgricultureViewProps> = ({
  site,
  zones,
  cvIssues,
  recommendations,
  alerts,
  comparisons,
  onSelectCvIssue,
  onApprove,
  onReject,
  onAcknowledgeAlert,
  onResolveAlert,
  initialSection = 'overview',
}) => {
  const [section, setSection] = useState<AgriSection>(initialSection);
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0]?.zoneId || 'zone-1');
  const [trendMetric, setTrendMetric] = useState<'soilMoisture' | 'temperature'>('soilMoisture');

  const activeZone = zones.find((z) => z.zoneId === selectedZoneId) || zones[0];
  const pendingRecs = recommendations.filter((r) => r.status === 'pending');
  const activeAlerts = alerts.filter((a) => !a.isResolved);
  const trendPoints =
    trendMetric === 'soilMoisture'
      ? activeZone?.soilMoisture.historical24h
      : activeZone?.temperature.historical24h;
  const trendMax = trendMetric === 'soilMoisture' ? 45 : 40;

  return (
    <div id="agriculture-operations-view" className="space-y-1.5 animate-fade-in pb-12">
      <div className="bg-[#dcdad4] rounded-[24px] p-4 sm:p-5 border border-white/50">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="type-micro">Crop systems</span>
              <span className="type-caption type-muted">·</span>
              <span className="type-micro truncate">{site.name}</span>
            </div>
            <h1 className="type-page-title">Agriculture</h1>
            <p className="type-body type-muted mt-1 max-w-xl">
              Zones, schedule, alerts, and agronomic trends — one place.
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {pendingRecs.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#facc15] border border-[#facc15] type-caption pill-on-light">
                {pendingRecs.length} pending
              </span>
            )}
            {activeAlerts.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#d92d20] type-caption pill-on-dark">
                {activeAlerts.length} alerts
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#d3d0c9]/80 rounded-2xl border border-white/50 overflow-x-auto">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`px-3.5 py-1.5 rounded-xl type-body transition-all cursor-pointer whitespace-nowrap ${
                section === s.id
                  ? 'bg-[#1c1917] text-white'
                  : 'type-muted hover:text-[#211d19] hover:bg-white/50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {section === 'overview' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {(activeZone
              ? [
                  {
                    label: 'Crop stage',
                    value: activeZone.crop,
                    detail: activeZone.cropStage,
                  },
                  {
                    label: 'Soil moisture',
                    value: `${activeZone.soilMoisture.current}%`,
                    detail: 'Root zone VWC',
                    status: activeZone.soilMoisture.status,
                  },
                  {
                    label: 'Canopy temp',
                    value: `${activeZone.temperature.current}°C`,
                    detail: 'Under-panel buffer',
                    status: activeZone.temperature.status,
                  },
                ]
              : []
            ).map((kpi) => (
              <div
                key={kpi.label}
                className="bg-[#dcdad4] rounded-[20px] p-4 border border-white/50"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="type-micro">{kpi.label}</span>
                  {kpi.status && statusPill(kpi.status)}
                </div>
                <div className="type-card-title">{kpi.value}</div>
                <div className="type-caption type-muted mt-0.5 truncate">{kpi.detail}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            <div className="bg-[#dcdad4] rounded-[20px] p-4 border border-white/50">
              <h2 className="type-card-title mb-3">Crop distribution</h2>
              <div className="flex flex-col gap-2.5">
                {CROPS.map((crop) => (
                  <div
                    key={crop.name}
                    className="flex items-center gap-3 type-card-title type-ink"
                  >
                    <span className="w-20 shrink-0">{crop.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-[#211d19]/10 overflow-hidden">
                      <div
                        className="h-full bg-[#1c1917] rounded-full"
                        style={{ width: crop.pct }}
                      />
                    </div>
                    <span className="type-caption w-12 text-right tabular-nums">{crop.pct}</span>
                    <span className="type-caption type-muted w-14 text-right">{crop.ha}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#dcdad4] rounded-[20px] p-4 border border-white/50">
              <h2 className="type-card-title mb-3">Crop health</h2>
              <div className="grid grid-cols-3 gap-1.5">
                {CROPS.map((crop) => {
                  const issue = cvIssues[crop.issueIdx];
                  return (
                    <button
                      key={crop.name}
                      type="button"
                      onClick={() => issue && onSelectCvIssue(issue)}
                      className="bg-[#d3d0c9]/65 rounded-[14px] p-1.5 border border-white/50 flex flex-col text-left cursor-pointer hover:border-white/80 transition-colors min-w-0"
                    >
                      <div className="flex items-center justify-between type-caption type-ink px-0.5 mb-1">
                        <span className="truncate">{crop.name}</span>
                        <span>{crop.row}</span>
                      </div>
                      <div className="relative flex-1 min-h-[72px] rounded-[10px] overflow-hidden bg-black/5">
                        <img
                          src={crop.img}
                          alt={crop.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 inset-x-1 flex justify-center">
                          <span className="px-1.5 py-0.5 rounded-full bg-[#d92d20] type-caption pill-on-dark whitespace-nowrap">
                            {crop.badge}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {section === 'zones' && activeZone && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 p-1 bg-[#dcdad4] rounded-2xl border border-white/50 overflow-x-auto w-fit max-w-full">
            {zones.map((zone) => (
              <button
                key={zone.zoneId}
                onClick={() => setSelectedZoneId(zone.zoneId)}
                className={`px-3.5 py-1.5 rounded-xl type-body transition-all cursor-pointer whitespace-nowrap ${
                  selectedZoneId === zone.zoneId
                    ? 'bg-[#1c1917] text-white'
                    : 'type-muted hover:text-[#211d19] hover:bg-white/50'
                }`}
              >
                {zone.zoneName.split('·')[0].trim()}
              </button>
            ))}
          </div>

          <div className="bg-[#dcdad4] rounded-[20px] p-4 sm:p-5 border border-white/50">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
              <div>
                <div className="type-micro mb-0.5">{activeZone.zoneName}</div>
                <h2 className="type-card-title">
                  {activeZone.crop} · {activeZone.cropStage}
                </h2>
              </div>
              <div className="type-caption type-muted">
                Tilt {activeZone.panelTiltAngle.toFixed(1)}° · {activeZone.shadingPercentage}% shade
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-4">
              {[
                {
                  label: 'Moisture',
                  value: `${activeZone.soilMoisture.current}%`,
                  status: activeZone.soilMoisture.status,
                },
                {
                  label: 'Temp',
                  value: `${activeZone.temperature.current}°C`,
                  status: activeZone.temperature.status,
                },
                {
                  label: 'Humidity',
                  value: `${activeZone.humidity.current}%`,
                  status: activeZone.humidity.status,
                },
                {
                  label: 'PAR',
                  value: `${activeZone.lightLevelPAR.current}`,
                  detail: 'µmol/m²/s',
                  status: activeZone.lightLevelPAR.status,
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="bg-[#d3d0c9]/65 rounded-[14px] p-3 border border-white/50"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="type-micro">{m.label}</span>
                    {statusPill(m.status)}
                  </div>
                  <div className="type-card-title tabular-nums">{m.value}</div>
                  {m.detail && (
                    <div className="type-caption type-muted mt-0.5">{m.detail}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-[#d3d0c9]/65 rounded-[16px] p-3 border border-white/50">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="type-body">24-hour trend</span>
                <div className="flex items-center gap-1">
                  {(['soilMoisture', 'temperature'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setTrendMetric(m)}
                      className={`px-2.5 py-1 rounded-lg type-caption cursor-pointer ${
                        trendMetric === m
                          ? 'bg-[#1c1917] text-white'
                          : 'type-muted hover:bg-white/50'
                      }`}
                    >
                      {m === 'soilMoisture' ? 'Moisture' : 'Temp'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 items-end h-24 pt-1">
                {(trendPoints || []).map((point, idx) => {
                  const heightPercent = Math.min(
                    100,
                    Math.max(12, (point.value / trendMax) * 100),
                  );
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center h-full justify-end"
                    >
                      <span className="type-caption type-ink mb-1 tabular-nums">
                        {trendMetric === 'soilMoisture'
                          ? `${point.value}%`
                          : `${point.value}°`}
                      </span>
                      <div className="w-full bg-[#211d19]/10 rounded-t-lg overflow-hidden h-full flex items-end">
                        <div
                          className="w-full rounded-t-lg bg-[#1c1917] transition-all duration-500"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="type-micro mt-1">{point.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {section === 'schedule' && (
        <div className="space-y-1.5">
          {pendingRecs.length === 0 ? (
            <div className="bg-[#dcdad4] rounded-[20px] p-6 text-center border border-white/50">
              <CheckCircle2 className="w-7 h-7 type-ink mx-auto mb-2" />
              <div className="type-card-title">No pending recommendations</div>
              <p className="type-body type-muted mt-1">Systems are in autonomous balance.</p>
            </div>
          ) : (
            pendingRecs.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#dcdad4] rounded-[20px] p-4 border border-white/50 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-full type-caption ${
                        rec.urgency === 'High'
                          ? 'bg-[#d92d20] pill-on-dark'
                          : 'bg-[#d3d0c9] border border-[#211d19]/10 type-ink'
                      }`}
                    >
                      {rec.urgency}
                    </span>
                    <span className="type-body">{rec.category}</span>
                    <span className="type-caption type-muted">
                      {rec.zone} · {rec.createdTime}
                    </span>
                  </div>
                </div>
                <div className="type-card-title">{rec.whatToDo}</div>
                <p className="type-body type-muted leading-relaxed line-clamp-3">
                  {rec.whyReasoning}
                </p>
                <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-[#211d19]/10">
                  <button
                    onClick={() => onReject(rec.id)}
                    className="px-3 py-1.5 rounded-xl type-body border border-[#d92d20]/30 text-[#d92d20] hover:bg-[#d92d20]/10 cursor-pointer inline-flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button
                    onClick={() => onApprove(rec.id)}
                    className="px-3.5 py-1.5 rounded-xl type-body bg-[#1c1917] text-white hover:bg-black cursor-pointer inline-flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {section === 'alerts' && (
        <div className="space-y-1.5">
          {alerts.length === 0 ? (
            <div className="bg-[#dcdad4] rounded-[20px] p-6 text-center border border-white/50">
              <CheckCircle2 className="w-7 h-7 type-ink mx-auto mb-2" />
              <div className="type-card-title">No alerts</div>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-[18px] p-4 border ${
                  alert.isResolved
                    ? 'bg-[#dcdad4]/60 border-[#211d19]/10 opacity-70'
                    : 'bg-[#dcdad4] border-white/50'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full type-caption ${
                          alert.severity === 'critical'
                            ? 'bg-[#d92d20] pill-on-dark'
                            : 'bg-[#d3d0c9] border border-[#211d19]/10 type-ink'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="type-caption type-muted">
                        {alert.zone} · {alert.timestamp}
                      </span>
                    </div>
                    <h2 className="type-card-title">{alert.title}</h2>
                    <p className="type-body type-muted mt-1 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                  {!alert.isResolved && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!alert.isAcknowledged && (
                        <button
                          onClick={() => onAcknowledgeAlert(alert.id)}
                          className="px-3 py-1.5 rounded-xl type-body bg-white/80 border border-[#211d19]/15 cursor-pointer"
                        >
                          Ack
                        </button>
                      )}
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-3 py-1.5 rounded-xl type-body bg-[#1c1917] text-white hover:bg-black cursor-pointer inline-flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {section === 'trends' && (
        <div className="space-y-1.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            <div className="bg-[#dcdad4] rounded-[20px] p-4 border border-white/50">
              <span className="type-micro">Crop yield</span>
              <div className="type-hero mt-1">+14.2%</div>
              <p className="type-caption type-muted mt-1">vs open field harvest</p>
            </div>
            <div className="bg-[#dcdad4] rounded-[20px] p-4 border border-white/50">
              <span className="type-micro">Water savings</span>
              <div className="type-hero mt-1">−31.8%</div>
              <p className="type-caption type-muted mt-1">irrigation volume</p>
            </div>
            <div className="bg-[#dcdad4] rounded-[20px] p-4 border border-white/50">
              <span className="type-micro">Premium grade</span>
              <div className="type-hero mt-1">89%</div>
              <p className="type-caption type-muted mt-1">fruit size class #1</p>
            </div>
          </div>

          <div className="bg-[#dcdad4] rounded-[20px] p-4 border border-white/50">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="type-card-title">AgriPV vs open field</h2>
              <div className="flex items-center gap-3 type-caption">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-xs bg-[#b4f53c]" /> AgriPV
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-xs bg-[#211d19]" /> Open
                </span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2 items-end h-36 px-1">
              {TREND_CHART.map((col) => (
                <div
                  key={col.label}
                  className="flex flex-col items-center gap-1 h-full justify-end"
                >
                  <div className="flex items-end gap-1 flex-1 w-full justify-center min-h-0">
                    <div
                      className="w-2.5 bg-[#b4f53c] rounded-t-xs"
                      style={{ height: `${col.agri}%` }}
                    />
                    <div
                      className="w-2.5 bg-[#211d19] rounded-t-xs"
                      style={{ height: `${col.open}%` }}
                    />
                  </div>
                  <span className="type-caption">{col.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#dcdad4] rounded-[20px] p-4 border border-white/50">
            <h2 className="type-card-title mb-3">Season metrics</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#211d19]/10 type-micro">
                    <th className="pb-2 font-normal">Metric</th>
                    <th className="pb-2 font-normal">AgriPV</th>
                    <th className="pb-2 font-normal">Open field</th>
                    <th className="pb-2 font-normal text-right">Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#211d19]/10">
                  {comparisons.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 type-body type-ink">{item.metric}</td>
                      <td className="py-2.5 type-body type-ink px-2">
                        {item.agriPvAdaptive}
                      </td>
                      <td className="py-2.5 type-body type-muted px-2">
                        {item.openFieldBaseline}
                      </td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`inline-flex items-center gap-1 type-caption px-2 py-0.5 rounded-md border ${
                            item.isPositive
                              ? 'bg-[#b4f53c] border-[#b4f53c] pill-on-light'
                              : 'bg-[#d92d20] border-[#d92d20] pill-on-dark'
                          }`}
                        >
                          <TrendingUp
                            className={`w-3 h-3 ${item.isPositive ? '' : 'rotate-180'}`}
                          />
                          {item.variance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
