import React, { useState } from 'react';
import { 
  Sliders, 
  Users, 
  Bell, 
  ShieldCheck, 
  Check, 
  Wind, 
  Sun, 
  Droplets,
  CheckCircle2
} from 'lucide-react';
import { AutonomySettings, TeamMember } from '../types';

interface SettingsViewProps {
  settings: AutonomySettings;
  teamMembers: TeamMember[];
  onUpdateSettings: (newSettings: AutonomySettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  teamMembers,
  onUpdateSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<AutonomySettings>(settings);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleToggleAutoExecute = () => {
    setLocalSettings(prev => ({
      ...prev,
      autoExecuteHighConfidence: !prev.autoExecuteHighConfidence
    }));
  };

  const handleNotificationToggle = (key: keyof AutonomySettings['notificationPreferences']) => {
    setLocalSettings(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: !prev.notificationPreferences[key]
      }
    }));
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div id="settings-autonomy-view" className="space-y-3 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="type-micro">
                System governance
              </span>
              <span className="text-xs text-[#797166]">·</span>
              <span className="type-micro">Safety interlocks & access</span>
            </div>
            <h1 className="type-page-title">System settings & access governance</h1>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#1c1917] hover:bg-black type-body text-white shadow-md transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Save settings</span>
          </button>
        </div>

        {savedNotice && (
          <div className="mt-3 bg-[#b4f53c]/25 type-ink p-2 rounded-xl type-body flex items-center gap-2 border border-[#b4f53c]/40">
            <CheckCircle2 className="w-4 h-4 type-ink" />
            <span>Autonomy parameters and notification settings updated across SCADA network.</span>
          </div>
        )}
      </div>

      {/* Section 1: Autonomy & Approval Thresholds */}
      <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#1c1917]" />
          <h3 className="type-card-title">
            Autonomous SCADA execution thresholds
          </h3>
        </div>

        <div className="space-y-3">
          {/* Master Autonomy Toggle */}
          <div className="bg-[#d3d0c9]/70 rounded-2xl p-4 border border-white/60 flex items-center justify-between">
            <div>
              <div className="type-body">Auto-execute high confidence recommendations</div>
              <p className="type-caption mt-0.5">
                Automatically execute tilt and shade adjustments when AI model confidence exceeds threshold and risk is Low.
              </p>
            </div>
            <button
              onClick={handleToggleAutoExecute}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                localSettings.autoExecuteHighConfidence ? 'bg-[#1c1917]' : 'bg-[#d3d0c9]'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  localSettings.autoExecuteHighConfidence ? 'left-7 bg-[#b4f53c]' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Slider 1: Confidence Threshold */}
          <div className="bg-[#d3d0c9]/65 rounded-2xl p-4 border border-white/60">
            <div className="flex items-center justify-between type-body mb-2">
              <span>Minimum AI confidence threshold for auto-action</span>
              <span className="tabular-nums type-ink font-normal">{localSettings.confidenceThresholdPercent}%</span>
            </div>
            <input
              type="range"
              min="75"
              max="98"
              value={localSettings.confidenceThresholdPercent}
              onChange={(e) => setLocalSettings({ ...localSettings, confidenceThresholdPercent: parseInt(e.target.value) })}
              className="w-full h-2 bg-[#d3d0c9] rounded-lg appearance-none cursor-pointer accent-[#1c1917]"
            />
            <div className="flex items-center justify-between text-[10px] text-[#797166] mt-1 font-normal">
              <span>75% (Faster Action)</span>
              <span>90% (Recommended Balance)</span>
              <span>98% (Conservative)</span>
            </div>
          </div>

          {/* Slider 2: Max Wind Stow Threshold */}
          <div className="bg-[#d3d0c9]/65 rounded-2xl p-4 border border-white/60">
            <div className="flex items-center justify-between type-body mb-2">
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 type-ink" />
                <span>Maximum wind gust auto-stow limit</span>
              </span>
              <span className="tabular-nums type-ink font-normal">{localSettings.windStowThresholdMs} m/s</span>
            </div>
            <input
              type="range"
              min="12"
              max="24"
              step="0.5"
              value={localSettings.windStowThresholdMs}
              onChange={(e) => setLocalSettings({ ...localSettings, windStowThresholdMs: parseFloat(e.target.value) })}
              className="w-full h-2 bg-[#d3d0c9] rounded-lg appearance-none cursor-pointer accent-[#1c1917]"
            />
            <div className="flex items-center justify-between text-[10px] text-[#797166] mt-1 font-normal">
              <span>12 m/s (High Safety)</span>
              <span>16 m/s (Standard AgriPV)</span>
              <span>24 m/s (Extreme Rating)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Notification Preferences */}
      <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#1c1917]" />
          <h3 className="type-card-title">
            Field alarm & notification routing
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {[
            { key: 'inverterFaults', label: 'Inverter Ground & DC String Faults' },
            { key: 'cropStressAlerts', label: 'Crop Canopy Heat & Water Stress' },
            { key: 'weatherStowWarnings', label: 'Wind Gust Auto-Stow Warnings' },
            { key: 'autoExecutionSummaries', label: 'Daily Autonomous AI Action Digest' },
          ].map((item) => {
            const isChecked = localSettings.notificationPreferences[item.key as keyof AutonomySettings['notificationPreferences']];
            return (
              <div 
                key={item.key}
                onClick={() => handleNotificationToggle(item.key as keyof AutonomySettings['notificationPreferences'])}
                className="bg-[#d3d0c9]/65 p-3 rounded-2xl border border-white/60 flex items-center justify-between cursor-pointer hover:bg-white transition-all"
              >
                <span className="type-body">{item.label}</span>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                  isChecked ? 'bg-[#1c1917] border-black text-white' : 'border-[#d3d0c9] bg-white'
                }`}>
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: User/Team Access Roles */}
      <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1c1917]" />
            <h3 className="type-card-title">
              User & team access hierarchy
            </h3>
          </div>
          <span className="type-body type-muted">RBAC Permissions</span>
        </div>

        <div className="space-y-2.5">
          {teamMembers.map((member) => (
            <div 
              key={member.id}
              className="bg-[#d3d0c9]/65 p-3.5 rounded-2xl border border-white/60 flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <div className="type-body">{member.name}</div>
                <div className="text-[11px] text-[#797166] font-normal">{member.email} · {member.role}</div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#1c1917] text-white text-[10px] font-normal">
                  {member.accessLevel}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#b4f53c]" title="Active on shift" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
