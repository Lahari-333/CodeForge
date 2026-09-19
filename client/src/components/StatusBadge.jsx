import React from 'react';
import { STATUS_COLORS } from '../constants/languages';

const StatusBadge = ({ status }) => {
  const config = STATUS_COLORS[status] || {
    bg: 'bg-slate-800',
    border: 'border-slate-700',
    text: 'text-slate-300',
    dot: 'bg-slate-400'
  };

  const formattedStatus = status ? status.replace(/_/g, ' ') : 'UNKNOWN';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border ${config.bg} ${config.border} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {formattedStatus}
    </span>
  );
};

export default StatusBadge;
