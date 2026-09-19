import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Code2, Lock, User, ArrowRight, Shield } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please enter both username/email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(identifier, password);
      showToast('Logged in successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (id, pw) => {
    setIdentifier(id);
    setPassword(pw);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#0E1524] border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-blue-500/5">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-2xl mb-3">
            <Code2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-1">Sign in to your CodeForge account</p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Username or Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. demouser or admin@codeforge.dev"
                className="w-full pl-10 pr-4 py-2.5 bg-[#080C14] border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-2.5 bg-[#080C14] border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-sm mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Fill Demo Credentials */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-[11px] uppercase font-mono tracking-wider text-slate-500 text-center mb-3">
            Quick Fill Demo Accounts
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fillDemo('demouser', 'DemoPassword@123')}
              className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 transition-colors text-center"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin', 'AdminPassword@123')}
              className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-amber-400 font-semibold transition-colors text-center flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
