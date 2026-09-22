import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  Calendar,
  Zap,
  Sprout,
  Droplets
} from 'lucide-react';
import { SeasonComparison } from '../types';

interface AnalyticsViewProps {
  comparisons: SeasonComparison[];
  onExportCsv: () => void;
  onExportJson: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  comparisons,
  onExportCsv,
  onExportJson,
}) => {
  const [selectedSeason] = useState('2025-2026 Production Cycle');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleCsvClick = () => {
    onExportCsv();
    setExportNotice('Telemetry and energy generation CSV generated & downloaded successfully.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleJsonClick = () => {
    onExportJson();
    setExportNotice('Raw IoT sensor and microclimate JSON bundle exported.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  const chartSeries = [
    { label: 'Yield', agri: 82, open: 72 },
    { label: 'Water', agri: 68, open: 100 },
    { label: 'Grade', agri: 89, open: 61 },
    { label: 'Sunburn', agri: 6, open: 42 },
    { label: 'LER', agri: 88, open: 50 },
  ];

  return (
    <div id="analytics-season-comparison-view" className="space-y-2.5 animate-fade-in pb-12">
      <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="type-micro">Agronomic & energy ROI</span>
              <span className="type-caption type-muted">·</span>
              <span className="type-micro">Field benchmark</span>
            </div>
            <h1 className="type-page-title">AgriPV vs open field benchmarks</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCsvClick}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#d3d0c9]/80 hover:bg-[#d3d0c9] type-body border border-white/50 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleJsonClick}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1c1917] hover:bg-black type-body text-white transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {exportNotice && (
          <div className="bg-[#b4f53c]/30 type-ink p-2.5 rounded-xl type-body flex items-center gap-2 mb-2 border border-[#b4f53c]/50">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-[#211d19]/10 type-caption">
          <div className="flex items-center gap-1.5 type-ink">
            <Calendar className="w-3.5 h-3.5" />
            <span>Benchmark period: {selectedSeason}</span>
          </div>
          <span className="type-micro">Control · adjacent unshaded 10-ha plot</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#1c1917] text-white flex items-center justify-center">
              <Sprout className="w-4 h-4" fill="currentColor" strokeWidth={1.25} />
            </div>
            <div>
              <span className="type-micro">Crop yield</span>
              <h2 className="type-card-title">Harvest differential</h2>
            </div>
          </div>
          <div className="type-hero my-2">+14.2%</div>
          <p className="type-body type-muted">
            Shade protection avoided heat dormancy; fruit sizing 89% Premium Grade #1.
          </p>
        </div>

        <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#1c1917] text-white flex items-center justify-center">
              <Droplets className="w-4 h-4" fill="currentColor" strokeWidth={1.25} />
            </div>
            <div>
              <span className="type-micro">Water savings</span>
              <h2 className="type-card-title">Evaporative reduction</h2>
            </div>
          </div>
          <div className="type-hero my-2">−31.8%</div>
          <p className="type-body type-muted">
            Conserved 133,400 m³ irrigation water due to moderated under-canopy vapor deficit.
          </p>
        </div>

        <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#1c1917] text-white flex items-center justify-center">
              <Zap className="w-4 h-4" fill="currentColor" strokeWidth={1.25} />
            </div>
            <div>
              <span className="type-micro">Grid feed-in</span>
              <h2 className="type-card-title">Clean solar revenue</h2>
            </div>
          </div>
          <div className="type-hero my-2">+$70,780</div>
          <p className="type-body type-muted">
            Exported 842.6 MWh to the regional electric grid with zero land competition.
          </p>
        </div>
      </div>

      <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="type-card-title">AgriPV vs open field</h2>
          <div className="flex items-center gap-3 type-caption">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-xs bg-[#b4f53c]" /> AgriPV
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-xs bg-[#211d19]" /> Open field
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 items-end h-40 px-1">
          {chartSeries.map((col) => (
            <div key={col.label} className="flex flex-col items-center gap-1 h-full justify-end">
              <div className="flex items-end gap-1 flex-1 w-full justify-center min-h-0">
                <div
                  className="w-2.5 sm:w-3 bg-[#b4f53c] rounded-t-xs"
                  style={{ height: `${col.agri}%` }}
                  title={`AgriPV ${col.agri}`}
                />
                <div
                  className="w-2.5 sm:w-3 bg-[#211d19] rounded-t-xs"
                  style={{ height: `${col.open}%` }}
                  title={`Open field ${col.open}`}
                />
              </div>
              <span className="type-caption">{col.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50">
        <h2 className="type-card-title mb-4">Season metric breakdown</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#211d19]/10 type-micro">
                <th className="pb-2.5 font-normal">Key performance indicator</th>
                <th className="pb-2.5 font-normal">AgriPV adaptive</th>
                <th className="pb-2.5 font-normal">Open field baseline</th>
                <th className="pb-2.5 font-normal text-right">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#211d19]/10">
              {comparisons.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#d3d0c9]/50 transition-colors">
                  <td className="py-3 type-body type-ink">{item.metric}</td>
                  <td className="py-3 type-body type-ink px-2">{item.agriPvAdaptive}</td>
                  <td className="py-3 type-body type-muted px-2">{item.openFieldBaseline}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 type-caption px-2 py-0.5 rounded-md border ${
                        item.isPositive
                          ? 'bg-[#b4f53c] border-[#b4f53c] pill-on-light'
                          : 'bg-[#d92d20] border-[#d92d20] pill-on-dark'
                      }`}
                    >
                      <TrendingUp className={`w-3.5 h-3.5 ${item.isPositive ? '' : 'rotate-180'}`} />
                      <span>{item.variance}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
