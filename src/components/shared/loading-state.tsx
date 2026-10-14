import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading adaptive learning data...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center my-8">
      <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}

export function ErrorState({
  title = 'Unable to load content',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50/50 rounded-2xl border border-red-200 max-w-md mx-auto my-6">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3 font-bold text-lg">
        !
      </div>
      <h3 className="text-base font-bold text-red-900 mb-1">{title}</h3>
      <p className="text-sm text-red-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
