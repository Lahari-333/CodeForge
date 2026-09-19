import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const difficultyColors = {
  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
};

const ProblemCard = ({ problem }) => {
  return (
    <Link
      to={`/problems/${problem.slug}`}
      className="group block p-5 bg-[#0E1524]/70 hover:bg-[#121B2F] border border-slate-800/80 hover:border-slate-700 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {problem.is_solved && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <h4 className="text-base font-semibold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
            {problem.title}
          </h4>
        </div>
        <span
          className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
            difficultyColors[problem.difficulty] || 'bg-slate-800 text-slate-300'
          }`}
        >
          {problem.difficulty}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 mt-4">
        <span className="px-2 py-0.5 rounded bg-slate-800/70 border border-slate-700/50 font-medium">
          {problem.category}
        </span>
        <span className="flex items-center gap-1 text-slate-500 group-hover:text-blue-400 font-medium transition-colors">
          Solve Problem
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
};

export default ProblemCard;
