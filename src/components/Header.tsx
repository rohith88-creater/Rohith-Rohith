import React from 'react';
import { ShieldCheck, Sparkles, HelpCircle, PhoneCall } from 'lucide-react';

interface HeaderProps {
  onOpenHelp: () => void;
  hasAi: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHelp, hasAi }) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-xs">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.2}
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
              <path d="M7 15h.01" />
              <path d="M11 15h2" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Payment Failure Assistant
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                {hasAi ? 'Gemini AI Active' : 'Smart Diagnostic'}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Diagnose UPI, card, and net banking failure causes & instant resolution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Sensitive Data</span>
          </div>

          <button
            id="header-get-help-button"
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
            <span>Bank Helplines</span>
          </button>
        </div>
      </div>
    </header>
  );
};
