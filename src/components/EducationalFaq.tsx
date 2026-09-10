import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Zap } from 'lucide-react';

export const EducationalFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Why did money get deducted from my account if the payment failed?',
      a: 'This is called a "dangling transaction". During a payment, your bank debits your account first and attempts to credit the receiver. If the network times out before receiving an acknowledgment, the debit stands while the merchant marks it failed. Your money is completely safe in the banking settlement pool and is automatically credited back within T+1 to T+2 banking days.'
    },
    {
      q: 'What should I do if a payment is stuck on "Pending"?',
      a: 'Do not initiate a duplicate payment right away. Wait 15 to 30 minutes. The payment switch periodically re-queries both banks. If it fails, the money will not leave your account (or will auto-reverse). Making a second payment while one is pending may cause you to pay twice.'
    },
    {
      q: 'What are the daily UPI transaction limits?',
      a: 'As per NPCI guidelines, the default daily limit for UPI is ₹1,00,000 (1 Lakh) per day and a maximum of 20 transactions per day per bank account. Certain categories like capital markets, insurance, or hospitals have higher caps (up to ₹5 Lakhs). Newly registered UPI accounts are often capped at ₹5,000 for the first 24 hours.'
    },
    {
      q: 'Can customer care ask for my UPI PIN or OTP to refund money?',
      a: 'NEVER! A refund or receiving money NEVER requires you to enter your UPI PIN, OTP, or CVV. Any person or SMS asking you to "enter PIN to receive refund" is a scam.'
    },
    {
      q: 'Why do card payments fail with "Declined by issuing bank"?',
      a: 'Due to central bank security guidelines, online (e-commerce) usage and international usage are disabled by default on newly issued debit and credit cards. You can instantly enable them by opening your bank mobile app, selecting "Card Controls", and turning on "Online Transactions".'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-indigo-600" />
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Payment Failure Knowledge Base & Safety Tips
        </h3>
      </div>

      <div className="divide-y divide-slate-100">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="py-3">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-800 hover:text-indigo-700 transition-colors py-1 cursor-pointer"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
