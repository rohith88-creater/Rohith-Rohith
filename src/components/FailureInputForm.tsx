import React, { useState } from 'react';
import { 
  Smartphone, 
  CreditCard, 
  Building2, 
  Clock, 
  AlertCircle, 
  IndianRupee, 
  DollarSign, 
  Sparkles, 
  HelpCircle, 
  Check, 
  RotateCcw,
  Search
} from 'lucide-react';
import { PaymentFailureInput, PaymentMethod, DebitedState } from '../types';
import { POPULAR_BANKS, ERROR_PRESETS } from '../data/mockAndFallback';

interface FailureInputFormProps {
  onSubmit: (data: PaymentFailureInput) => void;
  isLoading: boolean;
  onReset: () => void;
}

export const FailureInputForm: React.FC<FailureInputFormProps> = ({
  onSubmit,
  isLoading,
  onReset,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [errorMessage, setErrorMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('₹');
  const [bank, setBank] = useState('HDFC Bank');
  const [customBank, setCustomBank] = useState('');
  const [timeOfTransaction, setTimeOfTransaction] = useState('Just now (under 15 mins)');
  const [amountDebited, setAmountDebited] = useState<DebitedState>('no');
  const [referenceNumber, setReferenceNumber] = useState('');

  const paymentMethods: Array<{ id: PaymentMethod; label: string; icon: React.ReactNode; desc: string }> = [
    {
      id: 'upi',
      label: 'UPI',
      icon: <Smartphone className="w-4 h-4" />,
      desc: 'GPay, PhonePe, Paytm, BHIM',
    },
    {
      id: 'debit_card',
      label: 'Debit Card',
      icon: <CreditCard className="w-4 h-4" />,
      desc: 'Visa, Mastercard, RuPay',
    },
    {
      id: 'credit_card',
      label: 'Credit Card',
      icon: <CreditCard className="w-4 h-4" />,
      desc: 'Reward, Corporate & Travel',
    },
    {
      id: 'net_banking',
      label: 'Net Banking',
      icon: <Building2 className="w-4 h-4" />,
      desc: 'Direct Bank Portal Login',
    },
  ];

  const timeOptions = [
    'Just now (under 15 mins)',
    'Within the last hour',
    'Earlier today (1–12 hours ago)',
    '1–2 days ago',
    'More than 2 days ago',
  ];

  const handleApplyPreset = (preset: typeof ERROR_PRESETS[0]) => {
    setMethod(preset.method);
    setErrorMessage(preset.text);
    setAmountDebited(preset.debited);
    if (!amount) {
      setAmount('1500');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBank = bank === 'OTHER' ? (customBank.trim() || 'Other Bank') : bank;
    onSubmit({
      method,
      errorMessage: errorMessage.trim(),
      amount: amount.trim(),
      currency,
      bank: finalBank,
      timeOfTransaction,
      amountDebited,
      referenceNumber: referenceNumber.trim() || undefined,
    });
  };

  const handleClear = () => {
    setErrorMessage('');
    setAmount('');
    setAmountDebited('no');
    setReferenceNumber('');
    onReset();
  };

  return (
    <form
      id="payment-failure-input-form"
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6"
    >
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            1. Describe the Payment Issue
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Tell us what happened so our AI assistant can pinpoint the exact cause and fix.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="self-start sm:self-center text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5 py-1 px-2.5 rounded-md hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Form</span>
        </button>
      </div>

      {/* Quick Scenario Presets */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Or try common failure scenarios:
        </label>
        <div className="flex flex-wrap gap-2">
          {ERROR_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              id={`preset-btn-${idx}`}
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 hover:text-indigo-800 transition-all text-left flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
          Payment Method <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {paymentMethods.map((pm) => {
            const isSelected = method === pm.id;
            return (
              <button
                type="button"
                key={pm.id}
                id={`payment-method-${pm.id}`}
                onClick={() => setMethod(pm.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {pm.icon}
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div>
                  <span
                    className={`text-sm font-semibold block ${
                      isSelected ? 'text-indigo-950' : 'text-slate-800'
                    }`}
                  >
                    {pm.label}
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                    {pm.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Message / Failure Reason */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="error-message-input"
            className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            Error Message or What You Saw <span className="text-rose-500">*</span>
          </label>
          <span className="text-xs text-slate-400">e.g. Bank server timed out, Incorrect PIN, 503</span>
        </div>
        <textarea
          id="error-message-input"
          rows={3}
          required
          value={errorMessage}
          onChange={(e) => setErrorMessage(e.target.value)}
          placeholder="e.g. 'Bank server unresponsive while authorizing UPI PIN' or 'Payment failed on merchant page but money deducted'..."
          className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400 text-slate-800"
        />
      </div>

      {/* Amount and Bank Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount */}
        <div>
          <label
            htmlFor="amount-input"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Transaction Amount
          </label>
          <div className="relative flex rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 overflow-hidden">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Currency"
              className="bg-slate-50 px-3 text-sm font-medium text-slate-700 border-r border-slate-200 focus:outline-none"
            >
              <option value="₹">₹ (INR)</option>
              <option value="$">$ (USD)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
            </select>
            <input
              id="amount-input"
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 2499"
              className="w-full text-sm px-3 py-2.5 focus:outline-none text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Bank or Payment Provider */}
        <div>
          <label
            htmlFor="bank-select"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Bank / Payment Provider
          </label>
          <select
            id="bank-select"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 bg-white"
          >
            {POPULAR_BANKS.map((b) => (
              <option key={b.code} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
          {bank.includes('Other') && (
            <input
              type="text"
              placeholder="Enter bank name"
              value={customBank}
              onChange={(e) => setCustomBank(e.target.value)}
              className="mt-2 w-full text-sm px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
        </div>
      </div>

      {/* Transaction Time & Amount Debited Question */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Time of Transaction */}
        <div>
          <label
            htmlFor="time-select"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1"
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Time of Transaction
          </label>
          <select
            id="time-select"
            value={timeOfTransaction}
            onChange={(e) => setTimeOfTransaction(e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 bg-white"
          >
            {timeOptions.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Was money debited from account? */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            Was Money Deducted from Bank? <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'yes', label: 'Yes, Debited', color: 'border-orange-300 bg-orange-50/60 text-orange-900' },
              { id: 'no', label: 'No, Safe', color: 'border-emerald-300 bg-emerald-50/60 text-emerald-900' },
              { id: 'unsure', label: 'Not Sure', color: 'border-slate-300 bg-slate-50 text-slate-700' },
            ].map((option) => {
              const active = amountDebited === option.id;
              return (
                <button
                  type="button"
                  key={option.id}
                  id={`debited-${option.id}`}
                  onClick={() => setAmountDebited(option.id as DebitedState)}
                  className={`text-xs font-medium py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                    active
                      ? `${option.color} font-bold ring-2 ring-indigo-500/20 shadow-xs`
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Optional 12-Digit Reference / UTR */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="reference-number-input"
            className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1"
          >
            12-Digit UTR / Ref Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <span className="text-[11px] text-slate-400">Found in bank SMS or app statement</span>
        </div>
        <input
          id="reference-number-input"
          type="text"
          maxLength={30}
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          placeholder="e.g. 423910892019 (Safe to share - not a secret)"
          className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          id="submit-analysis-button"
          disabled={isLoading || !errorMessage.trim()}
          className="w-full py-3.5 px-5 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Payment Failure Reason...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Diagnose Payment & Get Step-by-Step Solution</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
