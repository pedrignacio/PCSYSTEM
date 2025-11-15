"use client";

import React from 'react';
import Toast from './Toast';

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastData[];
  onRemoveToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-0 left-0 z-[100] pointer-events-none">
      <div className="flex flex-col gap-2 p-4">
        {toasts.map((toast, index) => (
          <div 
            key={toast.id}
            className="pointer-events-auto"
            style={{ zIndex: 100 + index }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              isVisible={true}
              onClose={() => onRemoveToast(toast.id)}
              duration={toast.duration}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;