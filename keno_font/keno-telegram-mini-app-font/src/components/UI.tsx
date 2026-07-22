import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 p-8">
      <div className="relative w-12 h-12">
        <div className="absolute w-full h-full border-4 border-violet-500/20 rounded-full"></div>
        <div className="absolute w-full h-full border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-gray-400 font-display animate-pulse">Contacting smart contract...</p>
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl sm:rounded-2xl glass-card border-t border-violet-500/20 p-6 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-800/60">
              <h3 className="text-lg font-bold font-display bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-800/80 transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto pt-4 flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Toast() {
  const { toast, hideToast } = useGameStore();

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.message, hideToast]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  const colors = {
    success: 'border-emerald-500/30 bg-emerald-950/20 shadow-emerald-950/10',
    error: 'border-rose-500/30 bg-rose-950/20 shadow-rose-950/10',
    info: 'border-blue-500/30 bg-blue-950/20 shadow-blue-950/10',
  };

  return (
    <AnimatePresence>
      {toast.message && toast.type && (
        <div className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg w-full max-w-sm pointer-events-auto ${colors[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="text-sm font-medium text-gray-200 flex-1">{toast.message}</p>
            <button
              onClick={hideToast}
              className="p-1 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="space-y-6">
        <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-800 hover:bg-gray-800/50 transition-colors text-sm font-semibold text-gray-400 hover:text-white"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-colors text-sm font-semibold text-white shadow-md casino-glow-purple"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
