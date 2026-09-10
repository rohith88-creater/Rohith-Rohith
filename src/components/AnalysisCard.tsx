import React, { useState } from 'react';
import { 
  CheckCircle2, 
  RotateCcw, 
  PhoneCall, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Share2
} from 'lucide-react';
import { AnalysisResult, PaymentFailureInput } from '../types';
import { StatusBadge } from './StatusBadge';

interface AnalysisCardProps {
  result: AnalysisResult;
  input: PaymentFailureInput;
  onTryAgain: () => void;
  onGetHelp: () => void;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({
  result,
  input,
  onTryAgain,
  onGetHelp,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [copiedDispute, setCopiedDispute] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [showDisputeTemplate, setShowDisputeTemplate] = useState(result.bankActionNeeded);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const copyDisputeText = () => {
    if (!result.disputeTemplate) return;
    const text = `Subject: ${result.disputeTemplate.subject}\n\n${result.disputeTemplate.body}`;
    navigator.clipboard.writeText(text);
    setCopiedDispute(true);
    setTimeout(() => setCopiedDispute(false), 2500);
  };

  const copySummaryText = () => {
    const text = `Payment Failure Diagnostic Report
----------------------------------------
Method: ${input.method.toUpperCase()}
Bank: ${input.bank}
Amount: ${input.currency} ${input.amount || 'N/A'}
Status: ${result.statusLabel}
Likely Cause: ${result.likelyReason}
Simple Explanation: ${result.simpleExplanation}
Retry Safe: ${result.canRetryNow ? 'Yes' : 'No - ' + result.retryRecommendation}
Turnaround Time: ${result.expectedResolutionTime}
`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const totalSteps = result.steps.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const allStepsCompleted = totalSteps > 0 && completedCount === totalSteps;

  return (
    <div id="analysis-results-card" className="space-y-6">
      {/* 1. Primary Status & Diagnosis Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Payment Status Diagnosis
              </span>
              {result.isAiGenerated && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  Gemini AI Verified
                </span>
              )}
            </div>
            <StatusBadge status={result.status} size="lg" showSubtext={true} />
          </div>

          <div className="flex items-center gap-2 self-start">
            <button
              id="copy-summary-button"
              type="button"
              onClick={copySummaryText}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy diagnosis summary"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Likely Reason Callout */}
        <div className="mt-5 space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Most Likely Reason for Failure
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              {result.likelyReason}
            </h3>
          </div>

          {/* Simple Explanation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block mb-1">
              Simple Explanation
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">
              {result.simpleExplanation}
            </p>
          </div>

          {/* Retry & Timing Recommendation */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              result.canRetryNow
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  result.canRetryNow ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}
              >
                {result.canRetryNow ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold">
                  {result.canRetryNow ? 'Safe to Retry' : 'Hold On: Do Not Retry Yet'}
                </h4>
                <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                  {result.retryRecommendation}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-left sm:text-right border-t sm:border-t-0 border-amber-200/60 pt-2 sm:pt-0">
              <div className="text-[11px] font-medium uppercase opacity-75 flex items-center gap-1 sm:justify-end">
                <Clock className="w-3 h-3" />
                Expected Resolution
              </div>
              <div className="text-xs font-bold mt-0.5">
                {result.expectedResolutionTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Step-by-Step Suggested Solutions Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Suggested Step-by-Step Resolution
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Follow these recommended actions in order to safely resolve the issue.
            </p>
          </div>
          <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {completedCount}/{totalSteps} Completed
          </div>
        </div>

        <div className="space-y-3">
          {result.steps.map((step, index) => {
            const isDone = Boolean(completedSteps[step.id]);
            return (
              <div
                key={step.id || index}
                id={`step-card-${index}`}
                onClick={() => toggleStep(step.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-200 opacity-90'
                    : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white text-transparent hover:border-slate-400'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      Step {index + 1}
                    </span>
                    {step.isUrgent && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        Priority
                      </span>
                    )}
                    <h4
                      className={`text-sm font-semibold ${
                        isDone ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {step.title}
                    </h4>
                  </div>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isDone ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {allStepsCompleted && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Great job! You have gone through all diagnostic steps.</span>
          </div>
        )}
      </div>

      {/* 3. Formal Dispute / Grievance Draft (if money was debited or bank action needed) */}
      {result.disputeTemplate && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowDisputeTemplate(!showDisputeTemplate)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Ready-to-Send Bank Grievance Draft
                </h3>
                <p className="text-xs text-slate-500">
                  Pre-filled template quoting transaction details to email or submit on bank portal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-600 hidden sm:inline">
                {showDisputeTemplate ? 'Hide Template' : 'Show Template'}
              </span>
              {showDisputeTemplate ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </div>

          {showDisputeTemplate && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">
                  Subject: <span className="text-slate-800 font-normal">{result.disputeTemplate.subject}</span>
                </span>
                <button
                  type="button"
                  id="copy-dispute-button"
                  onClick={copyDisputeText}
                  className="text-xs font-medium px-3 py-1 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedDispute ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Draft</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                {result.disputeTemplate.body}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Action Buttons: "Try Again" and "Get Help" */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          id="try-again-button"
          type="button"
          onClick={onTryAgain}
          className="w-full sm:w-auto px-6 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again / Test Another</span>
        </button>

        <button
          id="get-help-button"
          type="button"
          onClick={onGetHelp}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Get Help (Bank Directory & Dispute Guidelines)</span>
        </button>
      </div>
    </div>
  );
};
