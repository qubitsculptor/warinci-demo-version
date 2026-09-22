import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Check, 
  AlertOctagon, 
  Info, 
  Wrench, 
  Activity, 
  Bug, 
  Filter
} from 'lucide-react';
import { FarmAlert, AlertCategory, AlertSeverity } from '../types';

interface AlertsViewProps {
  alerts: FarmAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onResolveAlert: (id: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onAcknowledgeAlert,
  onResolveAlert,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (filterCategory !== 'all' && alert.category !== filterCategory) return false;
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    return true;
  });

  const getCategoryIcon = (category: AlertCategory) => {
    switch (category) {
      case 'equipment_fault':
        return <Wrench className="w-4 h-4" fill="currentColor" strokeWidth={1.25} />;
      case 'abnormal_reading':
        return <Activity className="w-4 h-4" fill="currentColor" strokeWidth={1.25} />;
      case 'disease_detection':
        return <Bug className="w-4 h-4" fill="currentColor" strokeWidth={1.25} />;
    }
  };

  return (
    <div id="alerts-faults-view" className="space-y-3 animate-fade-in pb-12">
      {/* Top Banner & Filter Controls */}
      <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="type-micro">
                Telemetry Watchdog
              </span>
              <span className="text-xs text-[#797166]">·</span>
              <span className="type-micro">Safety & health monitoring</span>
            </div>
            <h1 className="type-page-title">Alerts & diagnostic events</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="type-body type-muted">
              <span className="font-normal text-[#211d19]">{alerts.filter(a => !a.isResolved).length}</span> Active Alerts
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#211d19]/10">
          <div className="flex items-center gap-1.5 mr-2 type-micro">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>

          {[
            { id: 'all', label: 'All Categories' },
            { id: 'equipment_fault', label: 'Equipment Faults' },
            { id: 'abnormal_reading', label: 'Abnormal Readings' },
            { id: 'disease_detection', label: 'Crop Diseases' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1 rounded-full type-body transition-all cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'bg-[#d3d0c9]/60 type-muted hover:bg-white/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-1.5">
        {filteredAlerts.length === 0 ? (
          <div className="bg-[#d3d0c9]/60 rounded-[20px] p-8 text-center border border-white/50">
            <CheckCircle2 className="w-8 h-8 type-ink mx-auto mb-2" />
            <div className="type-card-title">No alerts matching filters</div>
            <p className="type-body type-muted mt-1">
              All inverters, tracker actuators, and soil probe telemetry are operating within nominal bands.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-[22px] p-4.5 border transition-all ${
                alert.isResolved 
                  ? 'bg-white/40 border-[#211d19]/10 opacity-70' 
                  : alert.severity === 'critical'
                  ? 'bg-[#dcdad4] border-[#f04438]/50 shadow-xs'
                  : 'bg-[#dcdad4] border-white/50 shadow-xs'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-xl bg-[#1c1917] text-white flex items-center justify-center shrink-0">
                    {getCategoryIcon(alert.category)}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-normal ${
                        alert.severity === 'critical' 
                          ? 'bg-[#d92d20] pill-on-dark' 
                          : 'bg-[#d3d0c9] text-[#211d19] border border-[#211d19]/10'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>

                      <span className="type-micro">
                        {alert.zone} · {alert.timestamp}
                      </span>

                      {alert.isAcknowledged && !alert.isResolved && (
                        <span className="type-caption">
                          (Acknowledged)
                        </span>
                      )}

                      {alert.isResolved && (
                        <span className="type-caption type-ink">
                          (Resolved)
                        </span>
                      )}
                    </div>

                    <h2 className="type-card-title">{alert.title}</h2>
                    <p className="type-body type-muted mt-1 leading-relaxed">{alert.description}</p>
                  </div>
                </div>

                {/* Acknowledge / Resolve Actions */}
                <div className="flex items-center gap-2 self-center sm:self-start">
                  {!alert.isAcknowledged && !alert.isResolved && (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-3 py-1.5 rounded-xl type-body bg-white/80 hover:bg-white text-[#57534e] border border-[#211d19]/15 transition-colors cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}

                  {!alert.isResolved ? (
                    <button
                      onClick={() => onResolveAlert(alert.id)}
                      className="px-3.5 py-1.5 rounded-xl type-body bg-[#1c1917] text-white hover:bg-black transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 type-body type-ink">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Archived</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
