import React, { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import LanguageSelector from '../components/LanguageSelector';
import OutputPanel from '../components/OutputPanel';
import { LANGUAGES } from '../constants/languages';
import { executionService } from '../services/executionService';
import { useToast } from '../context/ToastContext';
import { Play, RotateCcw, Terminal, ArrowRight, ShieldCheck } from 'lucide-react';

const EditorPage = () => {
  const { showToast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState(LANGUAGES[0].defaultCode);
  const [stdin, setStdin] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const handleLanguageChange = (langId) => {
    setSelectedLanguage(langId);
    const lang = LANGUAGES.find((l) => l.id === langId);
    if (lang) {
      setCode(lang.defaultCode);
    }
    setResult(null);
  };

  const handleReset = () => {
    const lang = LANGUAGES.find((l) => l.id === selectedLanguage);
    if (lang) {
      setCode(lang.defaultCode);
      showToast('Editor reset to starter template.', 'info');
    }
  };

  const handleRun = async () => {
    if (!code.trim()) {
      showToast('Source code cannot be empty.', 'warning');
      return;
    }

    try {
      setRunning(true);
      setResult(null);
      const res = await executionService.executeCode({
        language: selectedLanguage,
        code,
        stdin
      });
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Execution request failed.';
      showToast(msg, 'error');
      setResult({
        status: 'SYSTEM_ERROR',
        stdout: '',
        stderr: msg,
        executionTime: 0,
        memoryUsage: 0
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#0E1524] border border-slate-800 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Online Sandbox Editor
              <span className="flex items-center gap-1 text-[11px] font-normal text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Docker Isolated
              </span>
            </h2>
            <p className="text-xs text-slate-400">Write, execute, and debug code inside temporary containers</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleLanguageChange}
            disabled={running}
          />
          <button
            onClick={handleReset}
            disabled={running}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors disabled:opacity-50"
            title="Reset to default starter template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-105"
          >
            {running ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{running ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Execution Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Monaco Editor Container */}
        <div className="lg:col-span-7 h-[620px] bg-[#0E1524] border border-slate-800 rounded-2xl p-2 shadow-xl flex flex-col">
          <CodeEditor
            language={selectedLanguage}
            value={code}
            onChange={setCode}
            height="100%"
          />
        </div>

        {/* Input & Output Stack */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Custom Stdin Input */}
          <div className="bg-[#0E1524] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Standard Input (stdin)
              </span>
              <span className="text-[11px] text-slate-500">Optional</span>
            </div>
            <textarea
              rows={4}
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Provide program input here (e.g. 5\n1 2 3 4 5)..."
              className="w-full p-3 bg-[#07090E] border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 resize-y"
            />
          </div>

          {/* Execution Output Panel */}
          <div className="bg-[#0E1524] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2 min-h-[300px]">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Execution Terminal
            </div>
            <OutputPanel result={result} loading={running} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
