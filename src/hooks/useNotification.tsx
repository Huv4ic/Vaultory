import { useState, useCallback } from 'react';

export interface NotificationData {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  autoHide?: boolean;
  duration?: number;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationData>({
    show: false,
    message: '',
    type: 'success',
    autoHide: true,
    duration: 3000
  });

  const showNotification = useCallback((
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'success',
    autoHide: boolean = true,
    duration: number = 3000
  ) => {
    setNotification({
      show: true,
      message,
      type,
      autoHide,
      duration
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, show: false }));
  }, []);

  const showSuccess = useCallback((message: string, autoHide = true, duration = 3000) => {
    showNotification(message, 'success', autoHide, duration);
  }, [showNotification]);

  const showError = useCallback((message: string, autoHide = true, duration = 5000) => {
    showNotification(message, 'error', autoHide, duration);
  }, [showNotification]);

  const showWarning = useCallback((message: string, autoHide = true, duration = 4000) => {
    showNotification(message, 'warning', autoHide, duration);
  }, [showNotification]);

  const showInfo = useCallback((message: string, autoHide = true, duration = 3000) => {
    showNotification(message, 'info', autoHide, duration);
  }, [showNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
