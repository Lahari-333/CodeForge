import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { User, Mail, Calendar, Trophy, CheckCircle2, FileCode, Percent, Shield } from 'lucide-react';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await userService.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading developer profile..." size="lg" />;
  }

  if (error || !profile) {
    return <ErrorState message={error || 'Profile not available'} onRetry={fetchProfile} />;
  }

  const { user, stats } = profile;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Info Header Card */}
      <div className="p-8 bg-[#0E1524] border border-slate-800 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl shadow-blue-500/20 flex-shrink-0">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">{user?.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              @{user?.username}
            </span>
            {user?.role === 'ADMIN' && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <Shield className="w-3 h-3" /> Admin
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Member since {new Date(user?.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Solved Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Solved Progress Card */}
        <div className="p-6 bg-[#0E1524] border border-slate-800 rounded-3xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Solved Problems</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-white">{stats.totalSolved}</span>
              <span className="text-sm text-slate-500">/ {stats.totalProblems} total</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{
                  width: `${stats.totalProblems > 0 ? (stats.totalSolved / stats.totalProblems) * 100 : 0}%`
                }}
              />
            </div>
            <p className="text-[11px] text-slate-400 text-right font-mono">
              {stats.totalProblems > 0 ? Math.round((stats.totalSolved / stats.totalProblems) * 100) : 0}% Solved
            </p>
          </div>
        </div>

        {/* Acceptance Rate Card */}
        <div className="p-6 bg-[#0E1524] border border-slate-800 rounded-3xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Acceptance Rate</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-emerald-400">{stats.acceptanceRate}%</span>
              <span className="text-sm text-slate-500">accuracy</span>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-slate-800/80">
            <span>Accepted: <strong className="text-slate-200">{stats.acceptedSubmissions}</strong></span>
            <span>Total: <strong className="text-slate-200">{stats.totalSubmissions}</strong></span>
          </div>
        </div>

        {/* Total Submissions Card */}
        <div className="p-6 bg-[#0E1524] border border-slate-800 rounded-3xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Total Submissions</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-white">{stats.totalSubmissions}</span>
              <span className="text-sm text-slate-500">runs evaluated</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sandbox evaluation active</span>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown Bars */}
      <div className="p-8 bg-[#0E1524] border border-slate-800 rounded-3xl space-y-6">
        <h3 className="text-base font-bold text-white tracking-tight">Difficulty Breakdown</h3>

        <div className="space-y-4">
          {/* Easy */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-400">Easy</span>
              <span className="font-mono text-slate-400">
                {stats.solvedEasy} / {stats.totalEasy}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width: `${stats.totalEasy > 0 ? (stats.solvedEasy / stats.totalEasy) * 100 : 0}%`
                }}
              />
            </div>
          </div>

          {/* Medium */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-400">Medium</span>
              <span className="font-mono text-slate-400">
                {stats.solvedMedium} / {stats.totalMedium}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{
                  width: `${stats.totalMedium > 0 ? (stats.solvedMedium / stats.totalMedium) * 100 : 0}%`
                }}
              />
            </div>
          </div>

          {/* Hard */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-rose-400">Hard</span>
              <span className="font-mono text-slate-400">
                {stats.solvedHard} / {stats.totalHard}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full"
                style={{
                  width: `${stats.totalHard > 0 ? (stats.solvedHard / stats.totalHard) * 100 : 0}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Languages Used */}
      {stats.languagesUsed && stats.languagesUsed.length > 0 && (
        <div className="p-8 bg-[#0E1524] border border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight">Languages Utilized</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.languagesUsed.map((item) => (
              <div
                key={item.language}
                className="p-4 bg-[#080C14] border border-slate-800 rounded-2xl flex items-center justify-between"
              >
                <span className="uppercase font-mono font-bold text-slate-200 text-sm">{item.language}</span>
                <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-xs font-mono text-blue-400">
                  {item.count} submissions
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
