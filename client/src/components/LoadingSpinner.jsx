import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div
        className={`${sizeClasses[size]} border-blue-500/20 border-t-blue-500 rounded-full animate-spin`}
      />
      {text && <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
