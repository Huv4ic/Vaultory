import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export interface NotificationProps {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  autoHide?: boolean;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  show,
  message,
  type,
  onClose,
  autoHide = true,
  duration = 3000
}) => {
  useEffect(() => {
    if (show && autoHide) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoHide, duration, onClose]);

  if (!show) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-400 text-white';
      case 'error':
        return 'bg-red-600 border-red-400 text-white';
      case 'warning':
        return 'bg-yellow-600 border-yellow-400 text-white';
      case 'info':
        return 'bg-blue-600 border-blue-400 text-white';
      default:
        return 'bg-gray-600 border-gray-400 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'success':
        return 'bg-green-400';
      case 'error':
        return 'bg-red-400';
      case 'warning':
        return 'bg-yellow-400';
      case 'info':
        return 'bg-blue-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-right-2 duration-300">
      <div className={`px-6 py-4 rounded-lg shadow-2xl border-l-4 ${getTypeStyles()}`}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className={`w-6 h-6 ${getIconBg()} rounded-full flex items-center justify-center`}>
              {getIcon()}
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium">{message}</p>
            <p className="text-sm opacity-90">vaultory.pro</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-2 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* CSS стили для анимаций */}
      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-in.slide-in-from-right-2 {
          animation: slideInFromRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Notification;
