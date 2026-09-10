export type PaymentMethod = 'upi' | 'debit_card' | 'credit_card' | 'net_banking';

export type PaymentStatus = 'failed' | 'pending' | 'successful' | 'debited_but_failed';

export type DebitedState = 'yes' | 'no' | 'unsure';

export interface PaymentFailureInput {
  method: PaymentMethod;
  errorMessage: string;
  amount: string;
  currency: string;
  bank: string;
  timeOfTransaction: string;
  amountDebited: DebitedState;
  referenceNumber?: string;
}

export interface SolutionStep {
  id: string;
  title: string;
  description: string;
  isUrgent?: boolean;
  category: 'immediate' | 'verification' | 'escalation' | 'wait';
}

export interface AnalysisResult {
  status: PaymentStatus;
  statusLabel: string;
  likelyReason: string;
  simpleExplanation: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  canRetryNow: boolean;
  retryRecommendation: string;
  expectedResolutionTime: string;
  steps: SolutionStep[];
  bankActionNeeded: boolean;
  disputeTemplate?: {
    subject: string;
    body: string;
  };
  isAiGenerated: boolean;
}

export interface BankInfo {
  name: string;
  code: string;
  tollFree: string;
  upiHandleRegex?: string;
  portalUrl?: string;
}
