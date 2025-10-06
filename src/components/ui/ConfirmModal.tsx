// components/ui/ConfirmModal.tsx
'use client';

import { useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'delete' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'delete',
  isLoading = false
}: ConfirmModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    const baseClasses = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full";
    
    switch (type) {
      case 'delete':
        return (
          <div className={`${baseClasses} bg-red-100`}>
            <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className={`${baseClasses} bg-yellow-100`}>
            <svg className="h-6 w-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} bg-blue-100`}>
            <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const getConfirmButtonStyle = () => {
    const baseClasses = "w-full inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-6 py-3 text-base font-semibold text-white focus:outline-none focus:ring-4 transition-all duration-200 sm:ml-4 sm:w-auto sm:text-sm";
    
    switch (type) {
      case 'delete':
        return `${baseClasses} bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-red-500/50 active:scale-95`;
      case 'warning':
        return `${baseClasses} bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 focus:ring-yellow-500/50 active:scale-95`;
      default:
        return `${baseClasses} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500/50 active:scale-95`;
    }
  };

  const getCancelButtonStyle = () => {
    return "w-full inline-flex justify-center items-center rounded-lg border border-gray-300 shadow-sm px-6 py-3 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-200 sm:mt-0 sm:w-auto sm:text-sm active:scale-95";
  };

  const getModalStyle = () => {
    switch (type) {
      case 'delete':
        return "border-l-4 border-red-500";
      case 'warning':
        return "border-l-4 border-yellow-500";
      default:
        return "border-l-4 border-blue-500";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay with smooth animation */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-900/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <div className="absolute inset-0"></div>
        </div>

        {/* Modal panel with smooth animation */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className={`relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300 max-w-lg w-full mx-auto overflow-hidden ${getModalStyle()}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className={`px-6 py-4 ${
              type === 'delete' ? 'bg-gradient-to-r from-red-50 to-red-100' :
              type === 'warning' ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' :
              'bg-gradient-to-r from-blue-50 to-blue-100'
            }`}>
              <div className="flex items-center space-x-4">
                {getIcon()}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 truncate">
                    {title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <div className="mb-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 space-y-3 space-y-reverse sm:space-y-0">
                <button
                  type="button"
                  disabled={isLoading}
                  className={getCancelButtonStyle()}
                  onClick={onClose}
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  className={getConfirmButtonStyle()}
                  onClick={onConfirm}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              className="absolute top-4 right-4 inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
              onClick={onClose}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}