import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import ProblemsPage from './pages/ProblemsPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import SubmissionsPage from './pages/SubmissionsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

// Protected Route Wrapper for Authenticated Users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Authenticating session..." size="lg" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Verifying administrative rights..." size="lg" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// 404 Page
const NotFoundPage = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8">
    <h1 className="text-6xl font-extrabold font-mono text-blue-500 mb-2">404</h1>
    <h2 className="text-xl font-bold text-white mb-2">Page Not Found</h2>
    <p className="text-sm text-slate-400 max-w-sm mb-6">
      The requested route does not exist in the CodeForge platform.
    </p>
    <a
      href="/"
      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
    >
      Return to Home
    </a>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-blue-600/30 selection:text-blue-200">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/editor" element={<EditorPage />} />
                <Route path="/problems" element={<ProblemsPage />} />
                <Route path="/problems/:slug" element={<ProblemDetailPage />} />

                {/* User Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/submissions"
                  element={
                    <ProtectedRoute>
                      <SubmissionsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
