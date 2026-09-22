import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { CvInspectionModal } from './components/CvInspectionModal';
import { DashboardView } from './components/DashboardView';
import { SolarView } from './components/SolarView';
import { AgricultureView } from './components/AgricultureView';
import { SettingsView } from './components/SettingsView';

import { 
  SITES, 
  INITIAL_ENERGY, 
  INITIAL_TILT_STATUS, 
  ZONES_DATA, 
  CV_ISSUES, 
  RECOMMENDATIONS, 
  ACTION_HISTORY, 
  ALERTS_LIST, 
  CONNECTED_DEVICES, 
  SEASON_COMPARISON_DATA, 
  TEAM_MEMBERS, 
  INITIAL_AUTONOMY_SETTINGS 
} from './data/agriPvData';

import { 
  AgriPvSite, 
  PriorityMode, 
  CvDetectedIssue, 
  PanelTiltStatus, 
  AutonomousRecommendation, 
  ActionHistoryItem, 
  FarmAlert, 
  AutonomySettings 
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedSite, setSelectedSite] = useState<AgriPvSite>(SITES[0]);
  const [priorityMode, setPriorityMode] = useState<PriorityMode>('crop-weighted');
  const [energy, setEnergy] = useState(INITIAL_ENERGY);
  const [tiltStatus, setTiltStatus] = useState<PanelTiltStatus>(INITIAL_TILT_STATUS);
  const [zones, setZones] = useState(ZONES_DATA);
  const [cvIssues, setCvIssues] = useState<CvDetectedIssue[]>(CV_ISSUES);
  const [recommendations, setRecommendations] = useState<AutonomousRecommendation[]>(RECOMMENDATIONS);
  const [actionHistory, setActionHistory] = useState<ActionHistoryItem[]>(ACTION_HISTORY);
  const [alerts, setAlerts] = useState<FarmAlert[]>(ALERTS_LIST);
  const [devices] = useState(CONNECTED_DEVICES);
  const [settings, setSettings] = useState<AutonomySettings>(INITIAL_AUTONOMY_SETTINGS);
  const [isTabletFrame, setIsTabletFrame] = useState(false);
  const [inspectedCvIssue, setInspectedCvIssue] = useState<CvDetectedIssue | null>(null);

  const [waterTelemetry, setWaterTelemetry] = useState({
    liveFlowRateLpm: 0,
    dailyTotalM3: 41.2,
    moisturePercent: 26.7,
    efficiencyGainPercent: 31.4,
    isWateringActive: false,
    isSnoozed: false,
  });

  // Handle Priority Mode change with real-time effect on tracking & energy
  const handlePriorityModeChange = (newMode: PriorityMode) => {
    setPriorityMode(newMode);
    if (newMode === 'energy-weighted') {
      setTiltStatus(prev => ({
        ...prev,
        targetAngle: 36.5,
        currentAngle: 36.5,
        mode: 'Max Solar Irradiance',
      }));
      setEnergy(prev => ({ ...prev, liveKw: 535 }));
    } else if (newMode === 'crop-weighted') {
      setTiltStatus(prev => ({
        ...prev,
        targetAngle: 28.4,
        currentAngle: 28.4,
        mode: 'Dual-Objective Agro-Tracking',
      }));
      setEnergy(prev => ({ ...prev, liveKw: 485 }));
    } else if (newMode === 'recovery mode') {
      setTiltStatus(prev => ({
        ...prev,
        targetAngle: 0.0,
        currentAngle: 0.0,
        mode: 'Canopy Heat Protection',
      }));
      setEnergy(prev => ({ ...prev, liveKw: 390 }));
    }
  };

  // Handle Irrigation Watering Trigger
  const handleTriggerWatering = () => {
    setWaterTelemetry(prev => ({
      ...prev,
      isWateringActive: true,
      liveFlowRateLpm: 48.2,
    }));

    setTimeout(() => {
      setWaterTelemetry(prev => ({
        ...prev,
        isWateringActive: false,
        liveFlowRateLpm: 0,
        moisturePercent: 34.5,
      }));
      // Resolve any soil moisture critical alert
      setAlerts(prev => prev.map(a => 
        a.id === 'alert-1' ? { ...a, isAcknowledged: true, isResolved: true } : a
      ));
    }, 2500);

    const historyEntry: ActionHistoryItem = {
      id: `act-${Date.now()}`,
      recommendationId: 'rec-2',
      title: 'Pulsed Micro-Drip Irrigation Cycle Dispatched',
      actionTaken: 'Approved',
      executedBy: 'Dr. Elena Vance (Lead Agronomist)',
      timestamp: 'Just now',
      outcome: '8.2 m³ delivered to Sector 4B under-panel root zone; moisture restored to 34.5%.',
    };
    setActionHistory(prev => [historyEntry, ...prev]);
  };

  const handleToggleSnooze = () => {
    setWaterTelemetry(prev => ({ ...prev, isSnoozed: !prev.isSnoozed }));
  };

  // Recommendation Actions
  const handleApproveRecommendation = (id: string) => {
    const rec = recommendations.find(r => r.id === id);
    if (!rec) return;

    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));

    if (rec.category === 'Panel Tilt') {
      setTiltStatus(prev => ({ ...prev, currentAngle: 38.0, targetAngle: 38.0 }));
    } else if (rec.category === 'Irrigation') {
      handleTriggerWatering();
    }

    const historyEntry: ActionHistoryItem = {
      id: `act-${Date.now()}`,
      recommendationId: id,
      title: rec.title,
      actionTaken: 'Approved',
      executedBy: 'Dr. Elena Vance (Lead Agronomist)',
      timestamp: 'Just now',
      outcome: rec.expectedOutcome,
    };
    setActionHistory(prev => [historyEntry, ...prev]);
  };

  const handleRejectRecommendation = (id: string) => {
    const rec = recommendations.find(r => r.id === id);
    if (!rec) return;

    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));

    const historyEntry: ActionHistoryItem = {
      id: `act-${Date.now()}`,
      recommendationId: id,
      title: rec.title,
      actionTaken: 'Rejected',
      executedBy: 'Marcus K. Sterling (Chief Solar Engineer)',
      timestamp: 'Just now',
      outcome: 'Action declined; trackers remain on standard dual-objective trajectory.',
    };
    setActionHistory(prev => [historyEntry, ...prev]);
  };

  const handleModifyRecommendation = (id: string, updatedWhatToDo: string) => {
    setRecommendations(prev => prev.map(r => 
      r.id === id ? { ...r, whatToDo: updatedWhatToDo, status: 'approved' } : r
    ));

    const historyEntry: ActionHistoryItem = {
      id: `act-${Date.now()}`,
      recommendationId: id,
      title: 'Modified Recommendation Approved',
      actionTaken: 'Modified',
      executedBy: 'Dr. Elena Vance (Lead Agronomist)',
      timestamp: 'Just now',
      outcome: `Custom parameters executed: "${updatedWhatToDo.slice(0, 60)}..."`,
    };
    setActionHistory(prev => [historyEntry, ...prev]);
  };

  // Alert Actions
  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isAcknowledged: true } : a));
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isResolved: true, isAcknowledged: true } : a));
  };

  // CV Mitigation Action
  const handleApplyCvMitigation = (issueId: string) => {
    setCvIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: 'treated' } : i));
    // Stow flat for UV sunbath
    setTiltStatus(prev => ({
      ...prev,
      currentAngle: 0.0,
      mode: 'Canopy Heat Protection',
    }));
    const historyEntry: ActionHistoryItem = {
      id: `act-${Date.now()}`,
      recommendationId: issueId,
      title: 'Anti-Fungal Solar UV Sunbath Executed',
      actionTaken: 'Approved',
      executedBy: 'Dr. Elena Vance (Lead Agronomist)',
      timestamp: 'Just now',
      outcome: 'Panels stowed horizontal (0°) to expose powdery mildew colony to direct sterilizing UV-A radiation.',
    };
    setActionHistory(prev => [historyEntry, ...prev]);
  };

  // Data Export Functions
  const handleExportCsv = () => {
    const csvRows = [
      ['Timestamp', 'Site', 'PriorityMode', 'LiveKw', 'RatedCapacityKw', 'DailyYieldMWh', 'PanelTiltAngle', 'SoilMoisturePercent', 'CanopyTempC', 'AmbientTempC'],
      [
        new Date().toISOString(),
        selectedSite.name,
        priorityMode,
        energy.liveKw,
        energy.ratedCapacityKw,
        energy.dailyYieldMWh,
        tiltStatus.currentAngle,
        waterTelemetry.moisturePercent,
        zones[0].temperature.current,
        31.0
      ]
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agripv_telemetry_${selectedSite.id}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    const dataBundle = {
      exportTimestamp: new Date().toISOString(),
      site: selectedSite,
      priorityMode,
      energy,
      tiltStatus,
      waterTelemetry,
      zones,
      recommendations,
      actionHistory,
      alerts,
      devices,
      settings,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataBundle, null, 2))}`;
    const link = document.createElement("a");
    link.setAttribute("href", jsonString);
    link.setAttribute("download", `agripv_full_export_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingRecsCount = recommendations.filter(r => r.status === 'pending').length;
  const unacknowledgedAlertsCount = alerts.filter(a => !a.isAcknowledged && !a.isResolved).length;

  return (
    <div className="h-svh overflow-hidden bg-[#e8e6e1] flex font-sans antialiased text-[#211d19]">
      {/* Full-bleed app shell — no outer gaps */}
      <div 
        id="app-main-frame"
        className="w-full h-full overflow-hidden bg-[#e8e6e1] flex flex-col"
      >
        <div className="flex flex-1 min-h-0 overflow-visible">
          {/* Left Vertical Dock Navigation */}
          <Sidebar 
            activeTab={activeTab} 
            onSelectTab={setActiveTab}
            agricultureBadgeCount={pendingRecsCount + unacknowledgedAlertsCount}
          />

          {/* Right Main Content Area */}
          <div className={`flex-1 flex flex-col min-h-0 min-w-0 ${activeTab === 'dashboard' ? 'overflow-y-auto lg:overflow-hidden' : 'overflow-y-auto'}`}>
            {activeTab !== 'dashboard' && (
              <TopBar 
                sites={SITES}
                selectedSite={selectedSite}
                onSelectSite={setSelectedSite}
                priorityMode={priorityMode}
                onChangePriorityMode={handlePriorityModeChange}
                isTabletFrame={isTabletFrame}
                onToggleTabletFrame={() => setIsTabletFrame(!isTabletFrame)}
                onExportData={handleExportCsv}
                onBackToOverview={() => setActiveTab('dashboard')}
                activeTab={activeTab}
              />
            )}

            {/* Sub-Views Routing based on Sidebar Tab */}
            <main className={`flex-1 min-h-0 ${activeTab === 'dashboard' ? 'overflow-y-auto lg:overflow-hidden px-2.5 lg:px-3 pb-2.5 lg:pb-3 pt-0' : 'overflow-y-auto p-4 sm:p-6'}`}>
              {activeTab === 'dashboard' && (
                <DashboardView 
                  site={selectedSite}
                  sites={SITES}
                  onSelectSite={setSelectedSite}
                  priorityMode={priorityMode}
                  onChangePriorityMode={handlePriorityModeChange}
                  energy={energy}
                  tiltStatus={tiltStatus}
                  waterTelemetry={waterTelemetry}
                  zones={zones}
                  cvIssues={cvIssues}
                  onSelectCvIssue={(issue) => setInspectedCvIssue(issue)}
                  onTriggerWatering={handleTriggerWatering}
                  onToggleSnooze={handleToggleSnooze}
                  onOpenSchedule={() => setActiveTab('agriculture')}
                  onOpenAnalytics={() => setActiveTab('solar')}
                  onOpenZones={() => setActiveTab('agriculture')}
                />
              )}

              {activeTab === 'solar' && (
                <SolarView
                  site={selectedSite}
                  energy={energy}
                  tiltStatus={tiltStatus}
                  devices={devices}
                  onExportCsv={handleExportCsv}
                  onExportJson={handleExportJson}
                />
              )}

              {activeTab === 'agriculture' && (
                <AgricultureView
                  site={selectedSite}
                  zones={zones}
                  cvIssues={cvIssues}
                  recommendations={recommendations}
                  alerts={alerts}
                  comparisons={SEASON_COMPARISON_DATA}
                  onSelectCvIssue={(issue) => setInspectedCvIssue(issue)}
                  onApprove={handleApproveRecommendation}
                  onReject={handleRejectRecommendation}
                  onAcknowledgeAlert={handleAcknowledgeAlert}
                  onResolveAlert={handleResolveAlert}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView 
                  settings={settings}
                  teamMembers={TEAM_MEMBERS}
                  onUpdateSettings={setSettings}
                />
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Deep Inspection CV Modal */}
      {inspectedCvIssue && (
        <CvInspectionModal 
          issue={inspectedCvIssue}
          onClose={() => setInspectedCvIssue(null)}
          onApplyMitigation={handleApplyCvMitigation}
        />
      )}
    </div>
  );
}

export default App;
