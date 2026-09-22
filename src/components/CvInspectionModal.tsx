import React from 'react';
import { X, Sparkles, AlertTriangle, ShieldCheck, Sun, CheckCircle2, ArrowRight } from 'lucide-react';
import { CvDetectedIssue } from '../types';

interface CvInspectionModalProps {
  issue: CvDetectedIssue | null;
  onClose: () => void;
  onApplyMitigation: (issueId: string) => void;
}

export const CvInspectionModal: React.FC<CvInspectionModalProps> = ({
  issue,
  onClose,
  onApplyMitigation,
}) => {
  if (!issue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        id="cv-inspection-modal"
        className="bg-[#dcdad4] rounded-[28px] border border-white/60 shadow-2xl w-full max-w-xl overflow-hidden p-6 select-none"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full type-micro bg-[#d92d20] pill-on-dark shadow-xs">
              {issue.type} detection
            </span>
            <span className="type-body type-muted">{issue.timestamp}</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-[#211d19] flex items-center justify-center transition-colors cursor-pointer border border-[#211d19]/15"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image with CV Bounding Box Overlay */}
        <div className="relative h-60 rounded-2xl overflow-hidden border border-[#211d19]/15 mb-4 bg-black">
          <img 
            src={issue.imageUrl} 
            alt={issue.name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90"
          />
          {/* Simulated Edge AI Bounding Box */}
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-white/80 border-dashed rounded-lg shadow-sm flex flex-col justify-between p-1.5 pointer-events-none">
            <div className="self-start bg-[#1c1917] text-white type-caption px-1.5 py-0.5 rounded-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-white" />
              <span>{issue.name} ({issue.confidencePercent}%)</span>
            </div>
            <div className="self-end text-[11px] tabular-nums font-normal bg-black/70 text-white px-1 rounded-xs">
              IoU: 0.94 · Class: {issue.type}
            </div>
          </div>

          <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white type-caption">
            {issue.zone}
          </div>
        </div>

        {/* Diagnosis & Symptoms */}
        <div className="bg-white/70 rounded-2xl p-4 border border-white/70 mb-4">
          <h3 className="text-base font-normal text-[#211d19] mb-1">{issue.name}</h3>
          <p className="type-body leading-relaxed mb-3">{issue.symptoms}</p>

          {/* Suggested Mitigation */}
          <div className="bg-[#1c1917] text-white p-3 rounded-xl">
            <div className="flex items-center gap-1.5 type-caption text-white mb-1">
              <Sun className="w-3.5 h-3.5" />
              <span>AgriPV Microclimate Solar Treatment Action</span>
            </div>
            <p className="type-body text-white/80 leading-snug">
              {issue.suggestedMitigation}
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="type-body type-muted flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 type-ink" />
            <span>Organic Biocontrol · Non-Chemical</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl type-body hover:bg-white/60 transition-colors cursor-pointer"
            >
              Dismiss
            </button>

            <button
              onClick={() => {
                onApplyMitigation(issue.id);
                onClose();
              }}
              className="px-4 py-2 rounded-xl type-body bg-[#1c1917] text-white hover:bg-black transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <span>Execute Solar Sunbath</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
