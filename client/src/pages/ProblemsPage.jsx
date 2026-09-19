import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { problemService } from '../services/problemService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { Search, CheckCircle2, Circle, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const difficultyBadges = {
  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
};

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProblems = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await problemService.getProblems({
        search,
        difficulty,
        category,
        page,
        limit: 10
      });

      if (res.success && res.data) {
        setProblems(res.data.problems);
        setCategories(res.data.categories || []);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load problems.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProblems(1);
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [search, difficulty, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" /> Curated Problem Set
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Coding Challenges</h1>
        <p className="text-sm text-slate-400 mt-1">
          Solve algorithmic challenges with instant sandbox feedback across multiple languages.
        </p>
      </div>

      <div className="p-4 bg-[#0E1524] border border-slate-800 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems or tags..."
            className="w-full pl-10 pr-4 py-2 bg-[#07090E] border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1 p-1 bg-[#07090E] border border-slate-800 rounded-xl">
            {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  difficulty === d
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {categories.length > 0 && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-1.5 bg-[#07090E] border border-slate-800 rounded-xl text-xs text-slate-300 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading coding challenges..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchProblems(1)} />
      ) : problems.length === 0 ? (
        <div className="p-16 text-center bg-[#0E1524]/60 border border-slate-800 rounded-3xl">
          <p className="text-base font-semibold text-slate-300">No problems found</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing your search query or filters</p>
        </div>
      ) : (
        <div className="bg-[#0E1524] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0B0F17]/50 text-slate-400 uppercase tracking-wider font-mono">
                  <th className="py-4 pl-6 w-12 text-center">Status</th>
                  <th className="py-4 px-4">Title</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Difficulty</th>
                  <th className="py-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {problems.map((prob) => (
                  <tr key={prob.id} className="hover:bg-slate-800/25 transition-colors">
                    <td className="py-4 pl-6 text-center">
                      {prob.is_solved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        to={`/problems/${prob.slug}`}
                        className="text-sm font-semibold text-slate-200 hover:text-blue-400 transition-colors"
                      >
                        {prob.id}. {prob.title}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 font-medium">
                        {prob.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${
                          difficultyBadges[prob.difficulty] || 'text-slate-300'
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <Link
                        to={`/problems/${prob.slug}`}
                        className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Solve
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-800 bg-[#0B0F17]/30 flex items-center justify-between">
            <div className="text-xs text-slate-400 font-mono">
              Showing {problems.length} of {pagination.total} problems
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchProblems(pagination.page - 1)}
                className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-400 font-mono px-2">
                Page {pagination.page} of {pagination.totalPages || 1}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchProblems(pagination.page + 1)}
                className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemsPage;
