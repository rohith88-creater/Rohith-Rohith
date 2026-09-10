import React from 'react';
import { AlertCircle, Clock, CheckCircle2, AlertOctagon } from 'lucide-react';
import { PaymentStatus } from '../types';

interface StatusBadgeProps {
  status: PaymentStatus;
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showSubtext = false,
}) => {
  const config = {
    failed: {
      label: 'Payment Failed',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: AlertCircle,
      iconClass: 'text-rose-600',
      subtext: 'Transaction was declined; money was not deducted from your balance.',
      pillColor: 'bg-rose-600',
    },
    pending: {
      label: 'Payment Pending',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Clock,
      iconClass: 'text-amber-600',
      subtext: 'Transaction is in flight awaiting bank network confirmation.',
      pillColor: 'bg-amber-500',
    },
    successful: {
      label: 'Payment Successful',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      iconClass: 'text-emerald-600',
      subtext: 'Payment received by the merchant or receiver account.',
      pillColor: 'bg-emerald-600',
    },
    debited_but_failed: {
      label: 'Amount Debited but Payment Failed',
      badgeClass: 'bg-orange-50 text-orange-900 border-orange-300 ring-1 ring-orange-200',
      icon: AlertOctagon,
      iconClass: 'text-orange-600',
      subtext: 'Money left your account, but merchant did not receive settlement. Auto-refund window applies.',
      pillColor: 'bg-orange-600',
    },
  }[status];

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
    lg: 'text-base sm:text-lg px-4 py-2 gap-2.5 font-bold',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <div className="flex flex-col gap-1">
      <div
        id={`payment-status-badge-${status}`}
        className={`inline-flex items-center rounded-full border shadow-xs transition-all ${config.badgeClass} ${sizeClasses}`}
      >
        <span className={`w-2 h-2 rounded-full ${config.pillColor} animate-pulse`} />
        <Icon className={`${iconSizes} ${config.iconClass}`} />
        <span>{config.label}</span>
      </div>
      {showSubtext && (
        <p className="text-xs text-slate-500 mt-1 pl-1">{config.subtext}</p>
      )}
    </div>
  );
};
