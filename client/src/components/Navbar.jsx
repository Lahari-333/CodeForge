import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, Terminal, BookOpen, LayoutDashboard, History, Shield, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                CodeForge
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Sandbox
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            <NavLink to="/problems" className={navLinkClass}>
              <BookOpen className="w-4 h-4" />
              Problems
            </NavLink>
            <NavLink to="/editor" className={navLinkClass}>
              <Terminal className="w-4 h-4" />
              Online Editor
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </NavLink>
                <NavLink to="/submissions" className={navLinkClass}>
                  <History className="w-4 h-4" />
                  Submissions
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass}>
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-semibold">Admin Panel</span>
              </NavLink>
            )}
          </div>

          {/* User / Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-200 leading-tight">
                      {user?.username}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-tight">
                      {user?.role}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-[#0E1524] border-b border-slate-800 animate-in slide-in-from-top duration-200">
          <NavLink
            to="/problems"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
          >
            Problems
          </NavLink>
          <NavLink
            to="/editor"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
          >
            Online Editor
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/submissions"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
              >
                Submissions
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
              >
                Profile
              </NavLink>
            </>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-amber-400 hover:bg-slate-800"
            >
              Admin Panel
            </NavLink>
          )}
          <div className="pt-2 border-t border-slate-800">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-slate-800 rounded-lg"
              >
                Logout ({user?.username})
              </button>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm text-slate-300 border border-slate-700 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm text-white bg-blue-600 rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
