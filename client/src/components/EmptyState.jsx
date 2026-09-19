import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  action = null
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-[#0E1524]/60 border border-slate-800/80 rounded-2xl">
      <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 mb-4 text-slate-400">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
