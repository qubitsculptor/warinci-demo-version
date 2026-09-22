import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  History,
  ShieldAlert,
  Bot
} from 'lucide-react';
import { AutonomousRecommendation, ActionHistoryItem } from '../types';

interface RecommendationsViewProps {
  recommendations: AutonomousRecommendation[];
  actionHistory: ActionHistoryItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onModify: (id: string, updatedWhatToDo: string) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  actionHistory,
  onApprove,
  onReject,
  onModify,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  const handleStartEdit = (rec: AutonomousRecommendation) => {
    setEditingId(rec.id);
    setEditText(rec.whatToDo);
  };

  const handleSaveEdit = (id: string) => {
    onModify(id, editText);
    setEditingId(null);
  };

  const pendingRecs = recommendations.filter((r) => r.status === 'pending');
  const pastRecs = recommendations.filter((r) => r.status !== 'pending');

  return (
    <div id="recommendations-ops-view" className="space-y-3 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="type-micro flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-[#797166]" />
                <span>Autonomous AgriPV Agent v2.4</span>
              </span>
              <span className="text-xs text-[#797166]">·</span>
              <span className="type-micro">Dual-yield co-optimization engine</span>
            </div>
            <h1 className="type-page-title">Operational recommendations & action oversight</h1>
            <p className="type-body type-muted mt-1 max-w-2xl">
              Synthesizes real-time solar irradiance, spot electricity tariffs, soil water tension, and canopy thermal imaging to propose targeted tracker adjustments and irrigation schedules.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#d3d0c9]/60 px-4 py-2 rounded-2xl border border-white/60">
            <div className="text-center">
              <div className="type-hero">{pendingRecs.length}</div>
              <div className="type-micro">Pending review</div>
            </div>
            <span className="w-px h-8 bg-black/10" />
            <div className="text-center">
              <div className="type-hero">{actionHistory.length}</div>
              <div className="type-micro">Past actions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Recommendations Section */}
      <div className="space-y-2">
        <h2 className="type-card-title flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#1c1917]" />
          <span>Active recommendations awaiting operator action ({pendingRecs.length})</span>
        </h2>

        {pendingRecs.length === 0 ? (
          <div className="bg-[#d3d0c9]/60 rounded-[20px] p-6 text-center border border-white/50">
            <CheckCircle2 className="w-8 h-8 type-ink mx-auto mb-2" />
            <div className="type-card-title">All recommendations processed</div>
            <p className="type-body type-muted mt-1">
              The AgriPV tracking and irrigation systems are operating in dynamic autonomous balance.
            </p>
          </div>
        ) : (
          pendingRecs.map((rec) => {
            const isEditing = editingId === rec.id;
            return (
              <div 
                key={rec.id}
                className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50 space-y-4 transition-all"
              >
                {/* Header with Urgency & Category */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] ${
                      rec.urgency === 'High'
                        ? 'bg-[#d92d20] pill-on-dark font-normal shadow-xs'
                        : 'bg-[#d3d0c9] text-[#211d19] border border-[#211d19]/10 font-normal'
                    }`}>
                      {rec.urgency} Urgency
                    </span>

                    <span className="type-body">
                      {rec.category}
                    </span>

                    <span className="text-xs text-[#797166]">·</span>
                    <span className="type-body type-muted">{rec.zone} · {rec.createdTime}</span>
                  </div>

                  <span className="type-body type-ink bg-[#facc15]/25 px-2 py-0.5 rounded-md border border-[#facc15]/40">
                    Pending Approval
                  </span>
                </div>

                {/* What to Do (Interactive Modify support) */}
                <div className="bg-[#d3d0c9]/70 rounded-2xl p-4 border border-white/70">
                  <div className="type-micro mb-1 flex items-center justify-between">
                    <span>What to do (Proposed Execution Action)</span>
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(rec)}
                        className="text-xs type-ink hover:type-ink font-normal flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Modify Parameters</span>
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 mt-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-[#211d19]/20 bg-white focus:outline-hidden font-normal"
                        rows={2}
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 type-body type-muted hover:text-black cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(rec.id)}
                          className="px-3.5 py-1 type-body bg-[#1c1917] text-white rounded-lg cursor-pointer shadow-xs"
                        >
                          Apply Custom Parameters
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="type-card-title">{rec.whatToDo}</div>
                  )}
                </div>

                {/* Why Reasoning (Physics & Agronomics) */}
                <div className="bg-[#1c1917] text-white rounded-2xl p-4">
                  <div className="type-micro text-white/70 mb-1">
                    Why: Agronomic & PV Electrical Reasoning
                  </div>
                  <p className="type-body text-white/80 leading-relaxed">
                    {rec.whyReasoning}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-white/10 text-[11px] text-white font-normal flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Projected Outcome: {rec.expectedOutcome}</span>
                  </div>
                </div>

                {/* Operator Actions: Approve / Reject / Modify */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#211d19]/10">
                  <button
                    onClick={() => onReject(rec.id)}
                    className="px-4 py-2 rounded-xl type-body text-[#d92d20] bg-transparent hover:bg-[#d92d20]/10 border border-[#d92d20]/30 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject Action</span>
                  </button>

                  <button
                    onClick={() => handleStartEdit(rec)}
                    className="px-4 py-2 rounded-xl type-body bg-[#d3d0c9]/70 hover:bg-white border border-[#211d19]/15 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Adjust Specs</span>
                  </button>

                  <button
                    onClick={() => onApprove(rec.id)}
                    className="px-5 py-2 rounded-xl type-body bg-[#1c1917] text-white hover:bg-black transition-all cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Approve & Execute</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action History Log (Past Decisions + Outcomes) */}
      <div className="bg-[#dcdad4] rounded-[24px] p-5 border border-white/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#1c1917]" />
            <h3 className="type-card-title">
              Action history log
            </h3>
          </div>
          <span className="type-body type-muted">Audited Telemetry Log</span>
        </div>

        <div className="space-y-2.5">
          {actionHistory.map((item) => (
            <div 
              key={item.id}
              className="bg-[#d3d0c9]/65 rounded-2xl p-3.5 border border-white/60 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-[240px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] ${
                    item.actionTaken === 'Rejected'
                      ? 'bg-[#d92d20] pill-on-dark font-normal'
                      : 'bg-[#d3d0c9] text-[#211d19] border border-[#211d19]/10 font-normal'
                  }`}>
                    {item.actionTaken}
                  </span>
                  <span className="type-body">{item.title}</span>
                </div>

                <div className="text-xs text-[#211d19] font-normal">
                  {item.outcome}
                </div>
              </div>

              <div className="text-right text-[11px] text-[#797166]">
                <div className="font-normal text-[#211d19]">{item.executedBy}</div>
                <div>{item.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
