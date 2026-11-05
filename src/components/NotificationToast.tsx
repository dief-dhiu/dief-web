import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { IslamicStarIcon } from './IslamicPattern';

export interface ToastData {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface NotificationToastProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-white border border-gold/40 shadow-elevated rounded-xl p-3.5 flex items-start space-x-3 animate-fadeIn transition-all"
        >
          <div className="shrink-0 mt-0.5">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-deep" />}
            {t.type === 'info' && <IslamicStarIcon size={18} className="text-gold" />}
            {t.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-600" />}
          </div>
          <div className="flex-1 pr-1">
            <h5 className="text-xs font-bold text-forest">{t.title}</h5>
            <p className="text-[11px] text-charcoal-muted leading-relaxed mt-0.5">{t.message}</p>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-gray-400 hover:text-charcoal p-1 transition shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
