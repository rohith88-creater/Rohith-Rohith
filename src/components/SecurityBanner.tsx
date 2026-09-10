import React from 'react';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

export const SecurityBanner: React.FC = () => {
  return (
    <div
      id="security-guarantee-banner"
      className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 rounded-xl p-3.5 sm:p-4 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
    >
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0 mt-0.5 sm:mt-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-emerald-900 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-700 inline" />
            Security & Privacy Guarantee
          </h4>
          <p className="text-xs text-emerald-800/90 leading-relaxed mt-0.5">
            We <span className="font-bold underline decoration-emerald-500">never</span> ask for your UPI PIN, ATM PIN, OTP, CVV, passwords, or card numbers. Legitimate banks will never ask for your confidential credentials.
          </p>
        </div>
      </div>
      <div className="shrink-0 text-[11px] font-medium text-emerald-800 bg-white/80 border border-emerald-200 px-2.5 py-1 rounded-md self-end sm:self-center">
        Safe Diagnostic Sandbox
      </div>
    </div>
  );
};
