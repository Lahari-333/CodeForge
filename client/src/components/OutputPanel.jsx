import React from 'react';
import StatusBadge from './StatusBadge';
import { Clock, HardDrive, Terminal, AlertOctagon } from 'lucide-react';

const OutputPanel = ({ result, loading = false }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[#090D15] border border-slate-800/80 rounded-xl min-h-[160px]">
        <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-mono tracking-wider">EXECUTING IN DOCKER SANDBOX...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[#090D15] border border-slate-800/80 rounded-xl text-center min-h-[160px]">
        <Terminal className="w-8 h-8 text-slate-600 mb-2" />
        <p className="text-xs text-slate-400 font-mono">Run your code to inspect standard output and metrics</p>
      </div>
    );
  }

  const { status, stdout, stderr, executionTime, memoryUsage } = result;

  return (
    <div className="bg-[#090D15] border border-slate-800/80 rounded-xl overflow-hidden flex flex-col">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#0D131F] border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          {executionTime !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{executionTime} ms</span>
            </div>
          )}
          {memoryUsage !== undefined && memoryUsage > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <HardDrive className="w-3.5 h-3.5 text-slate-500" />
              <span>{memoryUsage} MB</span>
            </div>
          )}
        </div>
      </div>

      {/* Output Content */}
      <div className="p-4 space-y-3 font-mono text-xs">
        {stderr && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold uppercase tracking-wider text-[11px]">
              <AlertOctagon className="w-3.5 h-3.5" />
              Standard Error / Compiler Diagnostic
            </div>
            <pre className="p-3 bg-rose-950/20 border border-rose-900/30 text-rose-300 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-60">
              {stderr}
            </pre>
          </div>
        )}

        {stdout && (
          <div className="space-y-1">
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              Standard Output
            </div>
            <pre className="p-3 bg-[#05080E] border border-slate-800 text-slate-200 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-60">
              {stdout}
            </pre>
          </div>
        )}

        {!stdout && !stderr && status === 'SUCCESS' && (
          <div className="p-3 bg-slate-900/50 text-slate-400 rounded-lg text-center italic">
            (Program executed successfully with no output to stdout)
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
