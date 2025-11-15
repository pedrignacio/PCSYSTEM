"use client";

import { useState, useCallback } from 'react';

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((
    message: string, 
    type: 'success' | 'info' | 'warning' | 'error' = 'success',
    duration: number = 4000
  ) => {
    const id = Date.now().toString();
    const newToast: ToastData = {
      id,
      message,
      type,
      duration
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove después del duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast
  };
};