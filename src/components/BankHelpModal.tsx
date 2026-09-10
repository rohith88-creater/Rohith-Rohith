import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Phone, 
  ExternalLink, 
  ShieldAlert, 
  Clock, 
  FileQuestion, 
  Building,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { POPULAR_BANKS } from '../data/mockAndFallback';

interface BankHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BankHelpModal: React.FC<BankHelpModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'helplines' | 'guidelines' | 'utr_guide'>('helplines');

  if (!isOpen) return null;

  const filteredBanks = POPULAR_BANKS.filter((bank) =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bank.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="bank-help-modal"
        className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600" />
              Bank Helplines & Dispute Support
            </h3>
            <p className="text-xs text-slate-500">
              Official toll-free directories and regulatory settlement rights
            </p>
          </div>
          <button
            id="close-help-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-5 pt-2 gap-2 bg-slate-50/30">
          {[
            { id: 'helplines', label: 'Bank Directory' },
            { id: 'guidelines', label: 'RBI Auto-Reversal Rules' },
            { id: 'utr_guide', label: 'What is UTR / RRN?' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs font-semibold pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'helplines' && (
            <div className="space-y-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search bank name or code (e.g. SBI, HDFC, Paytm)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* Bank list */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {filteredBanks.map((bank) => (
                  <div
                    key={bank.code}
                    className="p-3 sm:p-3.5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900">
                        {bank.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-mono font-medium">{bank.tollFree}</span>
                      </div>
                    </div>

                    {bank.portalUrl && (
                      <a
                        href={bank.portalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="self-start sm:self-center text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guidelines' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                <h4 className="font-bold flex items-center gap-1.5 text-amber-900 mb-1">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  RBI Harmonisation of Turnaround Time (TAT)
                </h4>
                <p className="text-xs leading-relaxed">
                  Under Reserve Bank of India (RBI) circular DPSS.CO.PD No.629/02.01.014/2019-20, strict timelines exist for auto-reversal of customer funds in failed transactions.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <h5 className="font-semibold text-slate-900">1. UPI Transactions (Merchant or P2P)</h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    If your account is debited but beneficiary not credited: Auto-reversal must be completed by the bank within <strong>T + 1 day</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <h5 className="font-semibold text-slate-900">2. Card Transactions (E-Commerce / POS)</h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    If card is debited but merchant authentication failed: Auto-reversal must take place within <strong>T + 5 days</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <h5 className="font-semibold text-slate-900">3. Delayed Compensation Rights</h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    If the bank fails to reverse the money within the stipulated TAT, they are mandated to pay compensation of <strong>₹100 per day of delay</strong> directly to your account.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <h5 className="font-semibold text-slate-900">4. NPCI UPI Dispute Redressal Portal</h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    You can lodge an official dispute on the NPCI portal (npci.org.in/what-we-do/upi/dispute-redressal-mechanism) using your 12-digit UTR.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'utr_guide' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950">
                <h4 className="font-bold flex items-center gap-1.5 text-indigo-900 mb-1">
                  <FileQuestion className="w-4 h-4 text-indigo-600" />
                  What is a UTR or RRN Number?
                </h4>
                <p className="text-xs leading-relaxed">
                  <strong>UTR</strong> stands for <em>Unique Transaction Reference</em>, and <strong>RRN</strong> stands for <em>Retrieval Reference Number</em>. It is a 12-digit code generated by the banking switch (NPCI/RBI) for every digital payment.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <h5 className="font-semibold text-slate-900">Where to find it:</h5>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-xs text-slate-600">
                    <li>In your Bank Account SMS: Look for "UPI/Ref no: 4239xxxxxxxx"</li>
                    <li>Inside your UPI app: Tap the transaction &gt; View Details &gt; Look for "UPI transaction ID" or "Bank Ref No."</li>
                    <li>In your Bank Passbook or Net Banking statement narration.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <h5 className="font-semibold text-slate-900">Is UTR safe to share?</h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    <strong>Yes.</strong> The UTR number is public tracking information, like a courier tracking code. It contains no financial access credentials and is required by bank support to trace your money.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
