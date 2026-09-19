import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ShieldCheck, Cpu, Code, CheckCircle, ArrowRight, Layers, Lock, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-blue-600/30">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
          <Zap className="w-3.5 h-3.5" />
          <span>Next-Generation Isolated Code Sandbox</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-tight sm:leading-tight">
          Code. Run. <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Solve.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
          A secure online coding platform for writing, testing, and submitting code in multiple programming languages with containerized sandboxing.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/editor"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/25 transition-all hover:scale-105"
          >
            <Terminal className="w-5 h-5" />
            Start Coding
          </Link>
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all hover:scale-105"
          >
            Explore Problems
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Code Editor Style Preview */}
        <div className="mt-14 w-full max-w-4xl mx-auto rounded-2xl border border-slate-800/80 bg-[#0B0F17] shadow-2xl shadow-blue-500/5 overflow-hidden text-left font-mono">
          <div className="flex items-center justify-between px-4 py-3 bg-[#0E1524] border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-xs text-slate-400 font-sans font-medium">Solution.py — Sandbox Mode</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-sans">
              <ShieldCheck className="w-4 h-4" />
              <span>Container Isolated</span>
            </div>
          </div>
          <div className="p-6 text-sm text-slate-300 leading-relaxed overflow-x-auto">
            <p className="text-slate-500"># CodeForge Sandbox Execution Engine</p>
            <p><span className="text-purple-400">def</span> <span className="text-blue-400">two_sum</span>(nums, target):</p>
            <p className="pl-4">lookup = {'{}'}</p>
            <p className="pl-4"><span className="text-purple-400">for</span> i, num <span className="text-purple-400">in</span> <span className="text-blue-300">enumerate</span>(nums):</p>
            <p className="pl-8">complement = target - num</p>
            <p className="pl-8"><span className="text-purple-400">if</span> complement <span className="text-purple-400">in</span> lookup:</p>
            <p className="pl-12"><span className="text-purple-400">return</span> [lookup[complement], i]</p>
            <p className="pl-8">lookup[num] = i</p>
            <p className="text-emerald-400 mt-3">&gt;&gt;&gt; [Docker Sandbox] Output: 0 1 | Status: ACCEPTED (18ms, 16MB)</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[#0B0F17] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Architected for Security & Performance
            </h2>
            <p className="mt-3 text-base text-slate-400">
              Every execution runs within an ephemeral, strictly sandboxed container with CPU, RAM, and network isolation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-[#0E1524]/60 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure Code Execution</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Untrusted user code executes in zero-network Docker containers with 128MB RAM limits, 0.5 CPU quotas, and timeout watchdogs.
              </p>
            </div>

            <div className="p-6 bg-[#0E1524]/60 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Language Support</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                First-class support for Python 3.11, OpenJDK 17 Java, and GCC C++ with compile & runtime diagnostic reporting.
              </p>
            </div>

            <div className="p-6 bg-[#0E1524]/60 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit mb-4">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Monaco Code Editor</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Industry-standard editor powered by Monaco with syntax highlighting, autocomplete, indentation, and dark theme.
              </p>
            </div>

            <div className="p-6 bg-[#0E1524]/60 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Coding Problems</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Carefully crafted algorithmic problems spanning Arrays, Two Pointers, Strings, Binary Search, and Dynamic Programming.
              </p>
            </div>

            <div className="p-6 bg-[#0E1524]/60 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl w-fit mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Automated Test Cases</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Test solutions instantly against sample test cases or grade securely against hidden edge-case test suites.
              </p>
            </div>

            <div className="p-6 bg-[#0E1524]/60 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl w-fit mb-4">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Submission Tracking</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Track full submission history, analyze runtime and memory profiles, and inspect your past solutions at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-white">How It Works</h2>
          <p className="mt-2 text-slate-400 text-sm">Four seamless steps from editor to verified submission.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Write Code', desc: 'Select Java, Python, or C++ and write your solution in the Monaco editor.' },
            { step: '02', title: 'Run in Sandbox', desc: 'Execute against custom input or sample tests inside an isolated container.' },
            { step: '03', title: 'Analyze Result', desc: 'Review stdout, compiler diagnostics, execution time, and memory footprint.' },
            { step: '04', title: 'Submit Solution', desc: 'Grade against hidden edge cases and record your verified solution to your profile.' }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#0E1524]/40 border border-slate-800 text-left relative overflow-hidden">
              <span className="text-3xl font-mono font-bold text-slate-700/50 mb-2 block">{item.step}</span>
              <h4 className="text-base font-semibold text-slate-200 mb-1">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-[#0B0F17] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase font-mono tracking-widest text-slate-400 mb-8">Powered By Industry Technologies</p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400 font-medium text-sm">
            <span className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">Docker Sandboxing</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">React 18 & Vite</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">Node.js & Express</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">MySQL 8.0</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">Monaco Editor</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">Tailwind CSS</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-800/80 bg-[#07090E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CodeForge Platform. Secure Containerized Code Execution.</p>
          <div className="flex items-center gap-6">
            <Link to="/problems" className="hover:text-slate-300 transition-colors">Problems</Link>
            <Link to="/editor" className="hover:text-slate-300 transition-colors">Online Editor</Link>
            <Link to="/login" className="hover:text-slate-300 transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
