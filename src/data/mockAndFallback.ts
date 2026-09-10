import { PaymentFailureInput, AnalysisResult, BankInfo } from '../types';

export const POPULAR_BANKS: BankInfo[] = [
  { name: 'State Bank of India (SBI)', code: 'SBI', tollFree: '1800 1234 / 1800 2100', portalUrl: 'https://bank.sbi' },
  { name: 'HDFC Bank', code: 'HDFC', tollFree: '1800 1600 / 1800 2600', portalUrl: 'https://www.hdfcbank.com' },
  { name: 'ICICI Bank', code: 'ICICI', tollFree: '1800 1080', portalUrl: 'https://www.icicibank.com' },
  { name: 'Axis Bank', code: 'AXIS', tollFree: '1860 419 5555 / 1860 500 5555', portalUrl: 'https://www.axisbank.com' },
  { name: 'Kotak Mahindra Bank', code: 'KOTAK', tollFree: '1860 266 2666', portalUrl: 'https://www.kotak.com' },
  { name: 'Punjab National Bank (PNB)', code: 'PNB', tollFree: '1800 180 2222', portalUrl: 'https://www.pnbindia.in' },
  { name: 'Bank of Baroda', code: 'BOB', tollFree: '1800 5700', portalUrl: 'https://www.bankofbaroda.in' },
  { name: 'Paytm Payments Bank', code: 'PAYTM', tollFree: '0120-4456-456', portalUrl: 'https://www.paytmbank.com' },
  { name: 'Google Pay / NPCI Helpline', code: 'GPAY', tollFree: '1800 419 0157', portalUrl: 'https://www.npci.org.in' },
  { name: 'PhonePe Support', code: 'PHONEPE', tollFree: '080-68727374 / 022-68727374', portalUrl: 'https://www.phonepe.com' },
  { name: 'Other Bank / International', code: 'OTHER', tollFree: 'Check back of your card or bank passbook', portalUrl: '' }
];

export const ERROR_PRESETS: Array<{ label: string; method: PaymentFailureInput['method']; text: string; debited: PaymentFailureInput['amountDebited'] }> = [
  {
    label: 'Money Deducted, Payment Failed',
    method: 'upi',
    text: 'Amount debited from bank account, but transaction marked as failed on app/merchant',
    debited: 'yes'
  },
  {
    label: 'Bank Server Unresponsive (503)',
    method: 'upi',
    text: 'Bank server is temporarily unavailable or timed out while processing',
    debited: 'no'
  },
  {
    label: 'Daily Limit Exceeded',
    method: 'upi',
    text: 'You have exceeded the maximum daily UPI transaction limit or count',
    debited: 'no'
  },
  {
    label: 'Card Declined by Bank',
    method: 'debit_card',
    text: 'Card payment declined by issuer bank (security or international transaction disabled)',
    debited: 'no'
  },
  {
    label: 'Payment Pending / Processing',
    method: 'net_banking',
    text: 'Payment status is currently pending or awaiting bank clearance',
    debited: 'unsure'
  },
  {
    label: 'Incorrect UPI PIN',
    method: 'upi',
    text: 'UPI PIN entered incorrectly (MPIN error)',
    debited: 'no'
  }
];

export function generateDiagnosticFallback(input: PaymentFailureInput): AnalysisResult {
  const textLower = (input.errorMessage || '').toLowerCase();
  const isDebited = input.amountDebited === 'yes';
  const isPending = textLower.includes('pending') || textLower.includes('processing') || textLower.includes('awaiting');
  const isTimeout = textLower.includes('timeout') || textLower.includes('timed out') || textLower.includes('unresponsive') || textLower.includes('503') || textLower.includes('server');
  const isLimit = textLower.includes('limit') || textLower.includes('exceeded') || textLower.includes('daily') || textLower.includes('cap');
  const isPinOrOtp = textLower.includes('pin') || textLower.includes('mpin') || textLower.includes('otp') || textLower.includes('password') || textLower.includes('credential');
  const isBalance = textLower.includes('insufficient') || textLower.includes('balance') || textLower.includes('funds');
  const isCardDecline = textLower.includes('declined') || textLower.includes('international') || textLower.includes('ecommerce') || textLower.includes('blocked');

  // Determine Status
  let status: AnalysisResult['status'] = 'failed';
  let statusLabel = 'Transaction Failed';

  if (isDebited) {
    status = 'debited_but_failed';
    statusLabel = 'Amount Debited but Payment Failed';
  } else if (isPending) {
    status = 'pending';
    statusLabel = 'Payment Pending / In Progress';
  } else if (textLower.includes('success') && !textLower.includes('not')) {
    status = 'successful';
    statusLabel = 'Payment Recorded as Successful';
  }

  // Reason & Explanation determination
  let likelyReason = 'Bank Network or Server Communication Disruption';
  let simpleExplanation = 'Your bank or the intermediary payment switch encountered a temporary disconnection while exchanging transaction settlement signals.';
  let urgencyLevel: AnalysisResult['urgencyLevel'] = isDebited ? 'high' : 'medium';
  let canRetryNow = !isDebited && !isPending;
  let retryRecommendation = isDebited 
    ? 'Do NOT retry payment immediately. Since money has left your account, a duplicate payment may charge you twice.'
    : 'You can safely attempt the payment again after verifying your bank balance and details.';
  let expectedResolutionTime = isDebited 
    ? 'Auto-reversal typically within T+1 to T+2 banking days (maximum T+5 days under central banking norms).'
    : isPending ? 'Bank updates status within 15 to 30 minutes.' : 'Immediate resolution after fixing the input error.';
  let bankActionNeeded = isDebited;

  const steps: AnalysisResult['steps'] = [];

  // Tailored steps based on inputs
  if (status === 'debited_but_failed') {
    likelyReason = 'Inter-Bank Settlement Latency (Dangling Transaction)';
    simpleExplanation = 'The money was debited from your bank account, but the payment gateway did not receive confirmation before timing out. Your money is completely safe in the banking clearing pool.';
    steps.push({
      id: 'step-1',
      title: 'Wait for Auto-Reversal (T+1 to T+2 Days)',
      description: 'Banking regulations (e.g. NPCI/RBI) require the remitter bank to automatically credit back unconfirmed debits within 24 to 48 hours.',
      isUrgent: true,
      category: 'wait'
    });
    steps.push({
      id: 'step-2',
      title: 'Note Down the 12-Digit Reference / UTR Number',
      description: 'Check your bank SMS or statement for the 12-digit UTR (Unique Transaction Reference) or RRN number. This is required for tracking.',
      isUrgent: false,
      category: 'verification'
    });
    steps.push({
      id: 'step-3',
      title: 'Do NOT Make a Duplicate Payment to the Same Merchant Right Away',
      description: 'Wait at least 30 minutes to verify if the merchant payment status updates from Pending to Successful, to prevent being charged twice.',
      isUrgent: true,
      category: 'immediate'
    });
    steps.push({
      id: 'step-4',
      title: 'Contact Bank or Raise a Dispute if Not Refunded in 48 Hours',
      description: `Call ${input.bank || 'your bank'}'s customer support or file a complaint on their official portal quoting the UTR number.`,
      isUrgent: false,
      category: 'escalation'
    });
  } else if (status === 'pending') {
    likelyReason = 'Transaction Awaiting Final Settlement from Remitter Bank';
    simpleExplanation = 'The transaction has been initiated but is waiting for your bank to acknowledge the authorization. The payment is neither completely failed nor completed yet.';
    canRetryNow = false;
    retryRecommendation = 'Wait 15-30 minutes before initiating any new transaction.';
    steps.push({
      id: 'step-1',
      title: 'Wait 15 Minutes and Refresh Your Banking / Payment App',
      description: 'Most pending transactions settle to either "Success" or "Failed" within 10-30 minutes.',
      isUrgent: true,
      category: 'wait'
    });
    steps.push({
      id: 'step-2',
      title: 'Check Your Account Statement / Mini-Statement',
      description: 'Verify whether the funds have been put on hold or actually deducted from your available balance.',
      isUrgent: false,
      category: 'verification'
    });
    steps.push({
      id: 'step-3',
      title: 'Do Not Initiate Another Payment Yet',
      description: 'Attempting another payment right now could result in a double deduction if this pending one clears.',
      isUrgent: true,
      category: 'immediate'
    });
  } else if (isPinOrOtp) {
    likelyReason = 'Authentication Failed (Incorrect PIN or Expired OTP)';
    simpleExplanation = 'The security PIN or one-time password entered did not match what the bank expected or expired before submission.';
    canRetryNow = true;
    retryRecommendation = 'You can retry immediately, but be cautious: 3 wrong PIN attempts will lock your UPI or card for 24 hours.';
    steps.push({
      id: 'step-1',
      title: 'Verify Your UPI PIN or Card Authentication',
      description: 'Make sure you are entering the correct 4 or 6 digit PIN. Remember that UPI PIN is distinct from your ATM PIN in many banks.',
      isUrgent: true,
      category: 'immediate'
    });
    steps.push({
      id: 'step-2',
      title: 'Reset UPI PIN if You Have Forgotten It',
      description: 'Use the "Forgot UPI PIN" option inside Google Pay, PhonePe, or BHIM using your debit card or Aadhaar.',
      isUrgent: false,
      category: 'verification'
    });
    steps.push({
      id: 'step-3',
      title: 'Check for SMS / OTP Delay',
      description: 'If using OTP, ensure your phone has network reception and request a fresh OTP rather than using an expired code.',
      isUrgent: false,
      category: 'verification'
    });
  } else if (isLimit) {
    likelyReason = 'Daily Transaction Limit or Velocity Cap Exceeded';
    simpleExplanation = 'Your bank or UPI network sets a maximum limit on amount or number of transfers per 24 hours (e.g. ₹1,00,000 / day or 20 transactions / day).';
    canRetryNow = false;
    retryRecommendation = 'Retry after the 24-hour window resets, or split the amount across multiple bank accounts / methods.';
    steps.push({
      id: 'step-1',
      title: 'Check Daily Bank & UPI Limits',
      description: 'Most banks enforce a maximum daily cap of ₹1 Lakh for UPI and specific limits for newly added beneficiaries (often ₹5,000 for first 24h).',
      isUrgent: true,
      category: 'verification'
    });
    steps.push({
      id: 'step-2',
      title: 'Try an Alternate Payment Mode',
      description: 'Use Net Banking (IMPS/NEFT) or a Credit Card if UPI limit is reached.',
      isUrgent: false,
      category: 'immediate'
    });
    steps.push({
      id: 'step-3',
      title: 'Adjust Card Limits in Your Mobile Banking App',
      description: 'Log into your bank app, go to "Manage Card" and verify that online (e-commerce) limit is high enough for this purchase.',
      isUrgent: false,
      category: 'verification'
    });
  } else if (isBalance) {
    likelyReason = 'Insufficient Available Balance in Account',
    simpleExplanation = 'The requested transaction amount exceeds your currently cleared balance (or minimum balance requirement).';
    canRetryNow = true;
    retryRecommendation = 'Check your cleared balance and retry after topping up or choosing another account.';
    steps.push({
      id: 'step-1',
      title: 'Check Bank Balance via Banking App',
      description: 'Verify your available balance. Remember that minimum balance requirements or uncleared cheques might reduce available funds.',
      isUrgent: true,
      category: 'immediate'
    });
    steps.push({
      id: 'step-2',
      title: 'Check for Linked Primary Bank Account',
      description: 'Ensure your UPI app is debiting from the account where funds are deposited.',
      isUrgent: false,
      category: 'verification'
    });
  } else if (isCardDecline) {
    likelyReason = 'Card Online / E-Commerce Transactions Disabled by Issuer';
    simpleExplanation = 'Banks routinely disable domestic online usage, international usage, or contactless tap-and-pay on new or existing cards by default for safety.';
    canRetryNow = true;
    retryRecommendation = 'Enable online e-commerce transactions in your bank app and retry.';
    steps.push({
      id: 'step-1',
      title: 'Enable Online Transactions in Bank App',
      description: 'Open your banking app > Cards > Card Controls > Toggle ON "Online / E-commerce transactions" and set an appropriate per-transaction limit.',
      isUrgent: true,
      category: 'immediate'
    });
    steps.push({
      id: 'step-2',
      title: 'Verify Expiry Date and CVV',
      description: 'Confirm your card has not expired. Ensure the card billing address matches the checkout details.',
      isUrgent: false,
      category: 'verification'
    });
    steps.push({
      id: 'step-3',
      title: 'Contact Bank to Unblock Card for Online Spend',
      description: 'If fraud prevention systems flagged this transaction, call the card issuer helpline to confirm it was you.',
      isUrgent: false,
      category: 'escalation'
    });
  } else {
    // Default server/network failure
    likelyReason = isTimeout 
      ? 'Bank Core Banking System (CBS) Server Timeout'
      : 'Payment Switch / Gateway Communication Interruption';
    simpleExplanation = 'The communication bridge between the merchant, payment gateway, and your bank took too long to reply or timed out before reaching final authorization.';
    canRetryNow = true;
    retryRecommendation = 'Wait 5 to 10 minutes and retry with a stable internet connection.';
    steps.push({
      id: 'step-1',
      title: 'Check Your Internet Connection',
      description: 'Switch between Wi-Fi and Cellular Data, or toggle Airplane mode on and off to refresh your DNS and connection socket.',
      isUrgent: true,
      category: 'immediate'
    });
    steps.push({
      id: 'step-2',
      title: 'Check Bank Balance Before Retrying',
      description: 'Quickly open your banking app or SMS inbox to confirm money was not deducted before pressing "Pay" again.',
      isUrgent: true,
      category: 'verification'
    });
    steps.push({
      id: 'step-3',
      title: 'Wait 5 to 10 Minutes Before Retrying',
      description: 'Bank servers undergo periodic settlement batching or maintenance, especially during peak hours or midnight.',
      isUrgent: false,
      category: 'wait'
    });
    steps.push({
      id: 'step-4',
      title: 'Try an Alternate Payment Method',
      description: 'If your bank server is undergoing maintenance, use a different bank account, Net Banking, or Credit Card.',
      isUrgent: false,
      category: 'immediate'
    });
  }

  // Generate dispute template if debited
  const disputeTemplate = isDebited ? {
    subject: `Urgent: Payment Failed but Amount Debited - ${input.bank || 'Bank'} [${input.currency || '₹'}${input.amount || '0'}]`,
    body: `Dear ${input.bank || 'Customer Support'} Team,

I am writing to report a failed transaction where the money was debited from my account, but the recipient/merchant did not receive the funds.

Transaction Details:
- Payment Method: ${input.method.toUpperCase()}
- Amount: ${input.currency || '₹'} ${input.amount || 'N/A'}
- Date & Time: ${input.timeOfTransaction || 'Recent'}
- Error Received: ${input.errorMessage || 'Transaction Failed / Timed out'}
- UTR / Reference No: ${input.referenceNumber || '[Please insert 12-digit UTR/RRN from bank SMS]'}

As per standard payment settlement guidelines, please confirm the status of this transaction and initiate an immediate auto-reversal of funds to my account.

Thank you,
[Your Name]
[Registered Mobile Number]`
  } : undefined;

  return {
    status,
    statusLabel,
    likelyReason,
    simpleExplanation,
    urgencyLevel,
    canRetryNow,
    retryRecommendation,
    expectedResolutionTime,
    steps,
    bankActionNeeded,
    disputeTemplate,
    isAiGenerated: false
  };
}
