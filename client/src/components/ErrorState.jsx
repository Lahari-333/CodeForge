import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorState = ({
  message = 'An unexpected error occurred while loading data.',
  onRetry = null
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-rose-950/20 border border-rose-800/30 rounded-2xl">
      <div className="p-4 bg-rose-900/30 rounded-2xl border border-rose-700/40 mb-4 text-rose-400">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-rose-200 mb-1">Error</h3>
      <p className="text-sm text-rose-300/80 max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
