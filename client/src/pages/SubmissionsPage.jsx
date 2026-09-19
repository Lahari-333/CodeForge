import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { executionService } from '../services/executionService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import Modal from '../components/Modal';
import CodeEditor from '../components/CodeEditor';
import { History, ChevronLeft, ChevronRight, Eye, Clock, HardDrive } from 'lucide-react';

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal for viewing submitted code
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loadingCode, setLoadingCode] = useState(false);

  const fetchSubmissions = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await executionService.getMySubmissions({ page, limit: 10 });
      if (res.success && res.data) {
        setSubmissions(res.data.submissions);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(1);
  }, []);

  const handleViewCode = async (subId) => {
    try {
      setLoadingCode(true);
      setViewModalOpen(true);
      const res = await executionService.getSubmissionById(subId);
      if (res.success && res.data?.submission) {
        setSelectedSubmission(res.data.submission);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCode(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-semibold mb-3">
          <History className="w-3.5 h-3.5" /> Submission Logs
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Submission History</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review all your grading results, runtimes, and inspect past source code.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving submission history..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchSubmissions(1)} />
      ) : submissions.length === 0 ? (
        <div className="p-16 text-center bg-[#0E1524]/60 border border-slate-800 rounded-3xl">
          <p className="text-base font-semibold text-slate-300">No submissions found</p>
          <p className="text-xs text-slate-500 mt-1">Solve problems and click "Submit" to start tracking your solutions.</p>
        </div>
      ) : (
        <div className="bg-[#0E1524] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0B0F17]/50 text-slate-400 uppercase tracking-wider font-mono">
                  <th className="py-4 pl-6">Problem</th>
                  <th className="py-4 px-4">Language</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Tests Passed</th>
                  <th className="py-4 px-4">Runtime</th>
                  <th className="py-4 px-4">Memory</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-mono">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/25 transition-colors">
                    <td className="py-4 pl-6 font-sans font-medium text-slate-200">
                      <Link to={`/problems/${sub.problem_slug}`} className="hover:text-blue-400 transition-colors">
                        {sub.problem_title}
                      </Link>
                    </td>
                    <td className="py-4 px-4 uppercase text-slate-400 font-semibold">{sub.language}</td>
                    <td className="py-4 px-4 font-sans">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {sub.passed_tests} / {sub.total_tests}
                    </td>
                    <td className="py-4 px-4 text-slate-400">{sub.execution_time || 0} ms</td>
                    <td className="py-4 px-4 text-slate-400">{sub.memory_usage ? `${sub.memory_usage} MB` : 'N/A'}</td>
                    <td className="py-4 px-4 text-slate-500 font-sans text-[11px]">
                      {new Date(sub.created_at).toLocaleString()}
                    </td>
                    <td className="py-4 pr-6 text-right font-sans">
                      <button
                        onClick={() => handleViewCode(sub.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        View Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-800 bg-[#0B0F17]/30 flex items-center justify-between">
            <div className="text-xs text-slate-400 font-mono">
              Showing {submissions.length} of {pagination.total} submissions
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchSubmissions(pagination.page - 1)}
                className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-400 font-mono px-2">
                Page {pagination.page} of {pagination.totalPages || 1}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchSubmissions(pagination.page + 1)}
                className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Code Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedSubmission(null);
        }}
        title={`Submission #${selectedSubmission?.id || ''} — ${selectedSubmission?.problem_title || ''}`}
        maxWidth="max-w-4xl"
      >
        {loadingCode || !selectedSubmission ? (
          <LoadingSpinner text="Fetching source code..." />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedSubmission.status} />
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                  {selectedSubmission.language}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Passed: {selectedSubmission.passed_tests}/{selectedSubmission.total_tests}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {selectedSubmission.execution_time} ms
                </span>
                {selectedSubmission.memory_usage > 0 && (
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                    {selectedSubmission.memory_usage} MB
                  </span>
                )}
              </div>
            </div>

            {selectedSubmission.error_message && (
              <div className="p-3 bg-rose-950/20 border border-rose-900/30 text-rose-300 text-xs rounded-xl font-mono">
                {selectedSubmission.error_message}
              </div>
            )}

            <div className="h-96 border border-slate-800 rounded-xl overflow-hidden">
              <CodeEditor
                language={selectedSubmission.language}
                value={selectedSubmission.source_code}
                readOnly={true}
                height="100%"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubmissionsPage;
