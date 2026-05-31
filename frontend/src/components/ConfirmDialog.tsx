import React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 text-left shadow-2xl transition-all rounded-xl sm:my-8 sm:w-full sm:max-w-lg">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3 uppercase tracking-wider">
              {title}
            </h3>
            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-row-reverse gap-3">
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex w-full justify-center bg-red-650 hover:bg-red-700 active:bg-red-800 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-150 sm:w-auto cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              {confirmText}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex w-full justify-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border border-gray-300 dark:border-gray-700 rounded-md transition-all duration-150 sm:w-auto cursor-pointer shadow-sm"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
