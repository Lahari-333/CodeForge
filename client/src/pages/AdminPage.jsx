import React, { useState, useEffect } from 'react';
import { problemService } from '../services/problemService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { Shield, Plus, Edit2, Trash2, ListChecks, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminPage = () => {
  const { showToast } = useToast();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create/Edit Problem Modal
  const [problemModalOpen, setProblemModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [problemForm, setProblemForm] = useState({
    title: '',
    difficulty: 'Easy',
    category: 'Algorithms',
    description: '',
    constraints: '',
    input_format: '',
    output_format: '',
    sample_input: '',
    sample_output: '',
    hidden_input: '',
    hidden_output: ''
  });

  // Test Cases Modal
  const [testCasesModalOpen, setTestCasesModalOpen] = useState(false);
  const [activeProblem, setActiveProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [loadingTestCases, setLoadingTestCases] = useState(false);
  const [newTestCase, setNewTestCase] = useState({
    input: '',
    expected_output: '',
    is_sample: false
  });

  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await problemService.getProblems({ page: 1, limit: 100 });
      if (res.success && res.data) {
        setProblems(res.data.problems);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load problems.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setProblemForm({
      title: '',
      difficulty: 'Easy',
      category: 'Algorithms',
      description: '',
      constraints: '',
      input_format: '',
      output_format: '',
      sample_input: '',
      sample_output: '',
      hidden_input: '',
      hidden_output: ''
    });
    setProblemModalOpen(true);
  };

  const handleOpenEditModal = (prob) => {
    setIsEditing(true);
    setEditingId(prob.id);
    setProblemForm({
      title: prob.title,
      difficulty: prob.difficulty,
      category: prob.category,
      description: prob.description || '',
      constraints: prob.constraints || '',
      input_format: prob.input_format || '',
      output_format: prob.output_format || '',
      sample_input: '',
      sample_output: '',
      hidden_input: '',
      hidden_output: ''
    });
    setProblemModalOpen(true);
  };

  const handleSaveProblem = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await problemService.updateProblem(editingId, {
          title: problemForm.title,
          difficulty: problemForm.difficulty,
          category: problemForm.category,
          description: problemForm.description,
          constraints: problemForm.constraints,
          input_format: problemForm.input_format,
          output_format: problemForm.output_format
        });
        showToast('Problem updated successfully!', 'success');
      } else {
        await problemService.createProblem({
          title: problemForm.title,
          difficulty: problemForm.difficulty,
          category: problemForm.category,
          description: problemForm.description,
          constraints: problemForm.constraints,
          input_format: problemForm.input_format,
          output_format: problemForm.output_format,
          test_cases: [
            {
              input: problemForm.sample_input,
              expected_output: problemForm.sample_output,
              is_sample: true
            },
            {
              input: problemForm.hidden_input,
              expected_output: problemForm.hidden_output,
              is_sample: false
            }
          ]
        });
        showToast('Problem created successfully!', 'success');
      }
      setProblemModalOpen(false);
      fetchProblems();
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  const handleDeleteProblem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem? All test cases and submissions will be deleted.')) {
      return;
    }
    try {
      await problemService.deleteProblem(id);
      showToast('Problem deleted successfully.', 'success');
      fetchProblems();
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  // Test Case Management
  const handleOpenTestCases = async (prob) => {
    setActiveProblem(prob);
    setTestCasesModalOpen(true);
    try {
      setLoadingTestCases(true);
      const res = await problemService.getAdminTestCases(prob.id);
      if (res.success && res.data) {
        setTestCases(res.data.testCases);
      }
    } catch (err) {
      showToast('Failed to load test cases.', 'error');
    } finally {
      setLoadingTestCases(false);
    }
  };

  const handleAddTestCase = async (e) => {
    e.preventDefault();
    if (!activeProblem) return;
    try {
      await problemService.addTestCase(activeProblem.id, newTestCase);
      showToast('Test case added.', 'success');
      setNewTestCase({ input: '', expected_output: '', is_sample: false });
      const res = await problemService.getAdminTestCases(activeProblem.id);
      if (res.success && res.data) {
        setTestCases(res.data.testCases);
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  const handleDeleteTestCase = async (tcId) => {
    try {
      await problemService.deleteTestCase(tcId);
      showToast('Test case deleted.', 'success');
      setTestCases((prev) => prev.filter((t) => t.id !== tcId));
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" /> Administrative Control
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Problem Management</h1>
          <p className="text-sm text-slate-400 mt-1">Create, edit, and configure problems and hidden test suites.</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Create New Problem
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading problems..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProblems} />
      ) : (
        <div className="bg-[#0E1524] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0B0F17]/50 text-slate-400 uppercase tracking-wider font-mono">
                  <th className="py-4 pl-6">ID</th>
                  <th className="py-4 px-4">Title</th>
                  <th className="py-4 px-4">Slug</th>
                  <th className="py-4 px-4">Difficulty</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {problems.map((prob) => (
                  <tr key={prob.id} className="hover:bg-slate-800/25 transition-colors">
                    <td className="py-4 pl-6 font-mono text-slate-400">{prob.id}</td>
                    <td className="py-4 px-4 font-semibold text-slate-200">{prob.title}</td>
                    <td className="py-4 px-4 font-mono text-slate-400">{prob.slug}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full border border-slate-700 bg-slate-800 font-semibold text-[11px]">
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{prob.category}</td>
                    <td className="py-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenTestCases(prob)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg border border-slate-700"
                        title="Manage Test Cases"
                      >
                        <ListChecks className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(prob)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg border border-slate-700"
                        title="Edit Problem"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProblem(prob.id)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg border border-slate-700"
                        title="Delete Problem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Problem Modal */}
      <Modal
        isOpen={problemModalOpen}
        onClose={() => setProblemModalOpen(false)}
        title={isEditing ? `Edit Problem #${editingId}` : 'Create New Problem'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveProblem} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">Title</label>
              <input
                type="text"
                value={problemForm.title}
                onChange={(e) => setProblemForm({ ...problemForm, title: e.target.value })}
                required
                className="w-full p-2.5 bg-[#080C14] border border-slate-800 rounded-xl text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">Difficulty</label>
              <select
                value={problemForm.difficulty}
                onChange={(e) => setProblemForm({ ...problemForm, difficulty: e.target.value })}
                className="w-full p-2.5 bg-[#080C14] border border-slate-800 rounded-xl text-slate-200"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">Category</label>
            <input
              type="text"
              value={problemForm.category}
              onChange={(e) => setProblemForm({ ...problemForm, category: e.target.value })}
              required
              className="w-full p-2.5 bg-[#080C14] border border-slate-800 rounded-xl text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">Description</label>
            <textarea
              rows={4}
              value={problemForm.description}
              onChange={(e) => setProblemForm({ ...problemForm, description: e.target.value })}
              required
              className="w-full p-2.5 bg-[#080C14] border border-slate-800 rounded-xl text-slate-200 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">Input Format</label>
              <textarea
                rows={2}
                value={problemForm.input_format}
                onChange={(e) => setProblemForm({ ...problemForm, input_format: e.target.value })}
                className="w-full p-2.5 bg-[#080C14] border border-slate-800 rounded-xl text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">Output Format</label>
              <textarea
                rows={2}
                value={problemForm.output_format}
                onChange={(e) => setProblemForm({ ...problemForm, output_format: e.target.value })}
                className="w-full p-2.5 bg-[#080C14] border border-slate-800 rounded-xl text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">Constraints</label>
            <input
              type="text"
              value={problemForm.constraints}
              onChange={(e) => setProblemForm({ ...problemForm, constraints: e.target.value })}
              className="w-full p-2.5 bg-[#080C14] border border-slate-800 rounded-xl text-slate-200"
            />
          </div>

          {!isEditing && (
            <div className="p-4 bg-[#080C14] border border-slate-800 rounded-2xl space-y-4">
              <span className="font-bold text-slate-300 uppercase tracking-wider block">Initial Test Cases</span>
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <span className="text-[11px] text-emerald-400 font-semibold">Sample Input:</span>
                  <input
                    type="text"
                    value={problemForm.sample_input}
                    onChange={(e) => setProblemForm({ ...problemForm, sample_input: e.target.value })}
                    required
                    className="w-full p-2 bg-[#0B0F17] border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-emerald-400 font-semibold">Sample Expected Output:</span>
                  <input
                    type="text"
                    value={problemForm.sample_output}
                    onChange={(e) => setProblemForm({ ...problemForm, sample_output: e.target.value })}
                    required
                    className="w-full p-2 bg-[#0B0F17] border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-blue-400 font-semibold">Hidden Input:</span>
                  <input
                    type="text"
                    value={problemForm.hidden_input}
                    onChange={(e) => setProblemForm({ ...problemForm, hidden_input: e.target.value })}
                    required
                    className="w-full p-2 bg-[#0B0F17] border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-blue-400 font-semibold">Hidden Expected Output:</span>
                  <input
                    type="text"
                    value={problemForm.hidden_output}
                    onChange={(e) => setProblemForm({ ...problemForm, hidden_output: e.target.value })}
                    required
                    className="w-full p-2 bg-[#0B0F17] border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setProblemModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl"
            >
              {isEditing ? 'Save Changes' : 'Create Problem'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Test Cases Modal */}
      <Modal
        isOpen={testCasesModalOpen}
        onClose={() => setTestCasesModalOpen(false)}
        title={`Test Cases — ${activeProblem?.title || ''}`}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-6 text-xs">
          {/* Add test case form */}
          <form onSubmit={handleAddTestCase} className="p-4 bg-[#080C14] border border-slate-800 rounded-2xl space-y-3">
            <span className="font-semibold text-slate-200 uppercase tracking-wider block">Add New Test Case</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Standard Input</label>
                <textarea
                  rows={2}
                  value={newTestCase.input}
                  onChange={(e) => setNewTestCase({ ...newTestCase, input: e.target.value })}
                  required
                  placeholder="Input string..."
                  className="w-full p-2 bg-[#0B0F17] border border-slate-800 rounded-lg text-slate-200"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Expected Output</label>
                <textarea
                  rows={2}
                  value={newTestCase.expected_output}
                  onChange={(e) => setNewTestCase({ ...newTestCase, expected_output: e.target.value })}
                  required
                  placeholder="Expected output..."
                  className="w-full p-2 bg-[#0B0F17] border border-slate-800 rounded-lg text-slate-200"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newTestCase.is_sample}
                  onChange={(e) => setNewTestCase({ ...newTestCase, is_sample: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-blue-600"
                />
                <span>Public Sample Test Case</span>
              </label>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
              >
                Add Test Case
              </button>
            </div>
          </form>

          {/* Test cases list */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-200 uppercase tracking-wider block">
              Configured Test Cases ({testCases.length})
            </span>
            {loadingTestCases ? (
              <LoadingSpinner text="Loading test cases..." />
            ) : testCases.length === 0 ? (
              <p className="text-slate-500 text-center py-6">No test cases configured yet.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {testCases.map((tc, idx) => (
                  <div
                    key={tc.id}
                    className="p-3 bg-[#080C14] border border-slate-800 rounded-xl flex items-start justify-between gap-4 font-mono"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-semibold text-slate-300">Case #{idx + 1}</span>
                        {tc.is_sample ? (
                          <span className="px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-sans">
                            Sample
                          </span>
                        ) : (
                          <span className="px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-sans">
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Input: <span className="text-slate-200">{tc.input}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Expected: <span className="text-slate-200">{tc.expected_output}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTestCase(tc.id)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                      title="Delete test case"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPage;
