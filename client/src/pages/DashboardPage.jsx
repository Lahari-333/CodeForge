import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import StatusBadge from '../components/StatusBadge';
import ProblemCard from '../components/ProblemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import {
  CheckCircle2,
  FileCode2,
  Trophy,
  Percent,
  Terminal,
  BookOpen,
  History,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await userService.getDashboard();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading your developer dashboard..." size="lg" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  const { stats, recentSubmissions, recommendedProblems, activityData, user } = data;

  // Chart data formatting
  const chartData = (activityData && activityData.length > 0)
    ? activityData.map(d => ({
        date: d.date.substring(5), // MM-DD
        total: Number(d.total),
        accepted: Number(d.accepted)
      }))
    : [
        { date: 'Mon', total: 0, accepted: 0 },
        { date: 'Tue', total: 0, accepted: 0 },
        { date: 'Wed', total: 0, accepted: 0 },
        { date: 'Thu', total: 0, accepted: 0 },
        { date: 'Fri', total: 0, accepted: 0 },
        { date: 'Sat', total: 0, accepted: 0 },
        { date: 'Sun', total: 0, accepted: 0 }
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-[#0E1524] to-[#121B2F] border border-slate-800 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Hello, <span className="text-blue-400">{user?.name || user?.username}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your coding milestones, test sandbox runs, and solve algorithmic challenges.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/editor"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-105"
          >
            <Terminal className="w-4 h-4" />
            Start Coding
          </Link>
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all hover:scale-105"
          >
            <BookOpen className="w-4 h-4" />
            Solve Problems
          </Link>
          <Link
            to="/submissions"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all hover:scale-105"
          >
            <History className="w-4 h-4" />
            View Submissions
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 bg-[#0E1524]/80 border border-slate-800/80 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Problems Solved</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {stats?.totalSolved || 0}
              <span className="text-sm text-slate-500 font-normal"> / {stats?.totalProblems || 10}</span>
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-[#0E1524]/80 border border-slate-800/80 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Submissions</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {stats?.totalSubmissions || 0}
            </h3>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
            <FileCode2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-[#0E1524]/80 border border-slate-800/80 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Accepted Runs</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {stats?.acceptedSubmissions || 0}
            </h3>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-[#0E1524]/80 border border-slate-800/80 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Success Rate</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {stats?.acceptanceRate || 0}%
            </h3>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400">
            <Percent className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Activity Chart & Quick Problem Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Activity Bar Chart */}
        <div className="lg:col-span-2 p-6 bg-[#0E1524]/80 border border-slate-800 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-semibold text-white">Recent Activity & Submissions</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Last 7 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#94A3B8' }}
                />
                <Bar dataKey="total" name="Total Attempts" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="accepted" name="Accepted" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommended Problems */}
        <div className="p-6 bg-[#0E1524]/80 border border-slate-800 rounded-3xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Recommended Problems</h3>
            <Link to="/problems" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {recommendedProblems && recommendedProblems.length > 0 ? (
              recommendedProblems.map((prob) => (
                <ProblemCard key={prob.id} problem={prob} />
              ))
            ) : (
              <div className="text-center py-10 text-xs text-slate-500">
                You've solved all recommended problems! Great work!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="p-6 bg-[#0E1524]/80 border border-slate-800 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">Recent Submissions</h3>
          </div>
          <Link to="/submissions" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
            Full History <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentSubmissions && recentSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 text-slate-400 uppercase tracking-wider font-mono">
                  <th className="pb-3 pl-2">Problem</th>
                  <th className="pb-3">Language</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Runtime</th>
                  <th className="pb-3 pr-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 pl-2 font-medium text-slate-200">
                      <Link to={`/problems/${sub.problem_slug}`} className="hover:text-blue-400">
                        {sub.problem_title}
                      </Link>
                    </td>
                    <td className="py-3.5 uppercase font-mono text-slate-400">{sub.language}</td>
                    <td className="py-3.5">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-3.5 font-mono text-slate-400">{sub.execution_time || 0} ms</td>
                    <td className="py-3.5 pr-2 text-right font-mono text-slate-500">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-xs">
            No submissions yet. Choose a problem and submit your first solution!
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
