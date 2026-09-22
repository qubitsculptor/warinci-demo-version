import React, { useState } from 'react';
import { 
  Cpu, 
  Wifi, 
  WifiOff, 
  Radio, 
  BatteryCharging, 
  ShieldCheck, 
  RefreshCw, 
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { DeviceSensor } from '../types';

interface DevicesViewProps {
  devices: DeviceSensor[];
}

export const DevicesView: React.FC<DevicesViewProps> = ({ devices }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredDevices = devices.filter((d) => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || d.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const onlineCount = devices.filter((d) => d.status === 'online').length;
  const warningCount = devices.filter((d) => d.status === 'warning').length;
  const offlineCount = devices.filter((d) => d.status === 'offline').length;

  return (
    <div id="devices-hardware-view" className="space-y-3 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="type-micro">
                Edge SCADA & IoT
              </span>
              <span className="text-xs text-[#797166]">·</span>
              <span className="type-micro">Field sensor inventory</span>
            </div>
            <h1 className="type-page-title">Connected AgriPV hardware & sensors</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full bg-[#b4f53c] border border-[#b4f53c] type-caption pill-on-light">
              {onlineCount} Online
            </span>
            {warningCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#facc15] border border-[#facc15] type-caption pill-on-light">
                {warningCount} Attention
              </span>
            )}
            {offlineCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#d92d20] type-caption pill-on-dark">
                {offlineCount} Offline
              </span>
            )}
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#211d19]/10">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[#797166] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by device model, zone, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#d3d0c9]/70 rounded-xl text-xs border border-white/60 focus:outline-hidden font-normal placeholder-[#797166]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {['all', 'Inverter', 'Single-Axis Tracker', 'Pyranometer / PAR', 'Multi-Depth Soil Probe', 'LoRaWAN Gateway'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full type-body transition-all whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#1c1917] text-white font-normal shadow-xs'
                    : 'bg-[#d3d0c9]/60 text-[#211d19] hover:bg-white'
                }`}
              >
                {cat === 'all' ? 'All Hardware' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hardware Grid Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filteredDevices.map((device) => (
          <div
            key={device.id}
            className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50 flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="type-micro">
                  {device.category}
                </span>

                <span className={`px-2.5 py-0.5 rounded-full text-[11px] ${
                  device.status === 'offline'
                    ? 'bg-[#d92d20] pill-on-dark font-normal'
                    : device.status === 'warning'
                    ? 'bg-[#facc15] border border-[#facc15] pill-on-light font-normal'
                    : 'bg-[#b4f53c] border border-[#b4f53c] pill-on-light font-normal'
                }`}>
                  {device.status.toUpperCase()}
                </span>
              </div>

              <h2 className="type-card-title">{device.name}</h2>
              <div className="type-body type-muted mt-0.5">{device.model}</div>

              {/* Specs & Protocol Details */}
              <div className="bg-[#d3d0c9]/65 rounded-xl p-3 border border-white/60 space-y-1.5 my-3 text-xs">
                <div className="flex items-center justify-between text-[#211d19]">
                  <span className="type-micro">Connector protocol</span>
                  <span className="tabular-nums text-[#211d19] font-normal">{device.connectorVersion}</span>
                </div>
                <div className="flex items-center justify-between text-[#211d19]">
                  <span className="type-micro">Firmware build</span>
                  <span className="tabular-nums text-[#211d19] font-normal">{device.firmwareVersion}</span>
                </div>
                <div className="flex items-center justify-between text-[#211d19]">
                  <span className="type-micro">Location / Zone</span>
                  <span className="text-[#211d19] font-normal">{device.zone}</span>
                </div>
              </div>
            </div>

            {/* Footer Telemetry Connection */}
            <div className="flex items-center justify-between pt-2 border-t border-[#211d19]/10 text-xs text-[#797166]">
              <div className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 type-ink" />
                <span className="font-normal text-[#211d19]">{device.batteryOrSignal}</span>
              </div>
              <div className="type-caption">
                Heartbeat: {device.lastHeartbeat}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
