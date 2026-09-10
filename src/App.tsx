import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { SecurityBanner } from './components/SecurityBanner';
import { FailureInputForm } from './components/FailureInputForm';
import { AnalysisCard } from './components/AnalysisCard';
import { BankHelpModal } from './components/BankHelpModal';
import { EducationalFaq } from './components/EducationalFaq';
import { PaymentFailureInput, AnalysisResult } from './types';
import { generateDiagnosticFallback } from './data/mockAndFallback';
import { Shield, Sparkles, CheckCircle2, Zap } from 'lucide-react';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [lastInput, setLastInput] = useState<PaymentFailureInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [hasAi, setHasAi] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Check health and Gemini API availability
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hasGeminiKey) {
          setHasAi(true);
        }
      })
      .catch(() => {
        // Fallback works automatically
      });
  }, []);

  const handleAnalyzeFailure = async (input: PaymentFailureInput) => {
    setIsLoading(true);
    setLastInput(input);

    try {
      const response = await fetch('/api/analyze-failure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const json = await response.json();

      if (json && json.success && json.data) {
        setAnalysisResult(json.data);
      } else {
        // Fallback to high-accuracy rule-based diagnostic engine
        const fallback = generateDiagnosticFallback(input);
        setAnalysisResult(fallback);
      }
    } catch (err) {
      console.warn('Using client-side fallback diagnosis:', err);
      const fallback = generateDiagnosticFallback(input);
      setAnalysisResult(fallback);
    } finally {
      setIsLoading(false);
      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleTryAgain = () => {
    setAnalysisResult(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setLastInput(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-800 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Header */}
      <Header onOpenHelp={() => setIsHelpModalOpen(true)} hasAi={hasAi} />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Security & Privacy Banner */}
        <SecurityBanner />

        {/* Feature Highlights Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="text-xs font-bold text-slate-900">UPI & Card Diagnostic</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Covers GPay, PhonePe, Cards</div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="text-xs font-bold text-slate-900">AI Root-Cause Finder</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Simple, plain language</div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="text-xs font-bold text-slate-900">Actionable Checklist</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Step-by-step resolution</div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="text-xs font-bold text-slate-900">Auto-Reversal Timelines</div>
            <div className="text-[11px] text-slate-500 mt-0.5">RBI TAT & Dispute drafts</div>
          </div>
        </div>

        {/* Input Form Section */}
        <div ref={formRef}>
          <FailureInputForm
            onSubmit={handleAnalyzeFailure}
            isLoading={isLoading}
            onReset={handleReset}
          />
        </div>

        {/* Analysis Results Section */}
        {analysisResult && lastInput && (
          <div ref={resultsRef} className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                2. Diagnostic Results & Suggested Actions
              </h2>
            </div>
            <AnalysisCard
              result={analysisResult}
              input={lastInput}
              onTryAgain={handleTryAgain}
              onGetHelp={() => setIsHelpModalOpen(true)}
            />
          </div>
        )}

        {/* Knowledge Base & FAQs */}
        <EducationalFaq />
      </main>

      {/* Bank Help Modal */}
      <BankHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-600">
            Payment Failure Assistant • Dedicated Payment Troubleshooting Tool
          </p>
          <p className="text-[11px] text-slate-400 max-w-xl mx-auto leading-relaxed">
            Privacy Notice: This tool never asks for or stores sensitive financial credentials (PIN, CVV, OTP, or full card numbers). Bank names, trademarks, and logos are properties of their respective institutions.
          </p>
        </div>
      </footer>
    </div>
  );
}
