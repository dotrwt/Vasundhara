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
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden bg-white border-2 border-gray-400 p-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-3 uppercase tracking-wider">
              {title}
            </h3>
            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-700">{message}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-row-reverse gap-3">
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex w-full justify-center bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 border-red-700 sm:w-auto cursor-pointer"
            >
              {confirmText}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex w-full justify-center bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-800 px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 border-gray-400 sm:w-auto cursor-pointer"
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
