import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { problemService } from '../services/problemService';
import { executionService } from '../services/executionService';
import CodeEditor from '../components/CodeEditor';
import LanguageSelector from '../components/LanguageSelector';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { LANGUAGES } from '../constants/languages';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Play,
  Send,
  RotateCcw,
  ArrowLeft,
  Clock,
  HardDrive
} from 'lucide-react';

const difficultyBadges = {
  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
};

const ProblemDetailPage = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState(LANGUAGES[0].defaultCode);

  const [activeTab, setActiveTab] = useState('sample_tests');
  const [customStdin, setCustomStdin] = useState('');

  const [runningSample, setRunningSample] = useState(false);
  const [sampleResults, setSampleResults] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const [customRunning, setCustomRunning] = useState(false);
  const [customResult, setCustomResult] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await problemService.getProblemBySlug(slug);
        if (res.success && res.data?.problem) {
          setProblem(res.data.problem);
          if (res.data.problem.sampleTestCases?.[0]?.input) {
            setCustomStdin(res.data.problem.sampleTestCases[0].input);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load problem.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [slug]);

  const handleLanguageChange = (langId) => {
    setSelectedLanguage(langId);
    const lang = LANGUAGES.find((l) => l.id === langId);
    if (lang) {
      setCode(lang.defaultCode);
    }
  };

  const handleReset = () => {
    const lang = LANGUAGES.find((l) => l.id === selectedLanguage);
    if (lang) {
      setCode(lang.defaultCode);
      showToast('Editor reset to template.', 'info');
    }
  };

  const handleRunSampleTests = async () => {
    if (!code.trim()) {
      showToast('Please enter your code before running.', 'warning');
      return;
    }

    try {
      setRunningSample(true);
      setActiveTab('sample_tests');
      setSampleResults(null);

      const res = await executionService.runSampleTests({
        problemId: problem.id,
        language: selectedLanguage,
        code
      });

      if (res.success && res.data) {
        setSampleResults(res.data);
        if (res.data.allPassed) {
          showToast('All sample test cases passed!', 'success');
        } else {
          showToast(`Sample tests (${res.data.passedCount}/${res.data.totalCount} passed)`, 'warning');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to execute sample tests.';
      showToast(msg, 'error');
    } finally {
      setRunningSample(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to submit your solution for grading.', 'warning');
      return;
    }

    if (!code.trim()) {
      showToast('Please enter your code before submitting.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      setActiveTab('submission_result');
      setSubmissionResult(null);

      const res = await executionService.submitSolution({
        problemId: problem.id,
        language: selectedLanguage,
        code
      });

      if (res.success && res.data) {
        setSubmissionResult(res.data);
        if (res.data.status === 'ACCEPTED') {
          showToast('Accepted! Solution verified successfully!', 'success');
        } else {
          showToast(`Submission finished: ${res.data.status}`, 'warning');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Submission failed.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRunCustom = async () => {
    try {
      setCustomRunning(true);
      setCustomResult(null);
      const res = await executionService.executeCode({
        language: selectedLanguage,
        code,
        stdin: customStdin
      });
      if (res.success && res.data) {
        setCustomResult(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCustomRunning(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading problem details..." size="lg" />;
  }

  if (error || !problem) {
    return <ErrorState message={error || 'Problem not found'} />;
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-[#07090E]">
      <div className="h-14 px-4 bg-[#0E1524] border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/problems"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-tight">{problem.title}</h2>
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                difficultyBadges[problem.difficulty]
              }`}
            >
              {problem.difficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleLanguageChange}
            disabled={runningSample || submitting}
          />
          <button
            onClick={handleReset}
            disabled={runningSample || submitting}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRunSampleTests}
            disabled={runningSample || submitting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
            <span>{runningSample ? 'Testing...' : 'Run Code'}</span>
          </button>
          <button
            onClick={handleSubmitSolution}
            disabled={runningSample || submitting}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Evaluating...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        <div className="lg:col-span-5 border-r border-slate-800 overflow-y-auto p-6 space-y-6 bg-[#0B0F17]">
          <div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{problem.category}</span>
            <h1 className="text-xl font-bold text-white mt-1">{problem.title}</h1>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Description</h3>
            <div className="whitespace-pre-wrap">{problem.description}</div>
          </div>

          {(problem.input_format || problem.output_format) && (
            <div className="space-y-4 pt-2 border-t border-slate-800/80">
              {problem.input_format && (
                <div className="space-y-1">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Input Format</h4>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap">{problem.input_format}</p>
                </div>
              )}
              {problem.output_format && (
                <div className="space-y-1">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Output Format</h4>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap">{problem.output_format}</p>
                </div>
              )}
            </div>
          )}

          {problem.constraints && (
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Constraints</h3>
              <pre className="p-3 bg-[#080C14] border border-slate-800/80 rounded-xl text-xs font-mono text-slate-300 whitespace-pre-wrap">
                {problem.constraints}
              </pre>
            </div>
          )}

          {problem.examples && problem.examples.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Examples</h3>
              {problem.examples.map((ex, idx) => (
                <div key={idx} className="p-4 bg-[#080C14] border border-slate-800/80 rounded-xl space-y-2 text-xs">
                  <div className="font-semibold text-slate-200">Example {idx + 1}:</div>
                  <div className="font-mono">
                    <span className="text-slate-500 block text-[11px]">Input:</span>
                    <div className="p-2 bg-slate-900/60 rounded text-slate-300 whitespace-pre-wrap">{ex.input}</div>
                  </div>
                  <div className="font-mono">
                    <span className="text-slate-500 block text-[11px]">Output:</span>
                    <div className="p-2 bg-slate-900/60 rounded text-slate-300 whitespace-pre-wrap">{ex.output}</div>
                  </div>
                  {ex.explanation && (
                    <div className="text-slate-400 text-[11px] pt-1">
                      <span className="font-semibold text-slate-300">Explanation: </span>
                      {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-[#0A0E17]">
          <div className="flex-1 p-2 overflow-hidden">
            <CodeEditor
              language={selectedLanguage}
              value={code}
              onChange={setCode}
              height="100%"
            />
          </div>

          <div className="h-64 border-t border-slate-800 bg-[#0E1524] flex flex-col flex-shrink-0">
            <div className="flex items-center gap-2 px-4 border-b border-slate-800/80 bg-[#0B0F17]">
              <button
                onClick={() => setActiveTab('sample_tests')}
                className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'sample_tests'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Sample Tests {sampleResults ? `(${sampleResults.passedCount}/${sampleResults.totalCount})` : ''}
              </button>
              <button
                onClick={() => setActiveTab('custom_input')}
                className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'custom_input'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Custom Input
              </button>
              <button
                onClick={() => setActiveTab('submission_result')}
                className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'submission_result'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Submission Result
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 text-xs">
              {activeTab === 'sample_tests' && (
                <div>
                  {runningSample ? (
                    <div className="flex items-center justify-center p-8 gap-2 text-slate-400 font-mono">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Running code against sample test cases in Docker sandbox...
                    </div>
                  ) : sampleResults ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={sampleResults.status} />
                        <span className="font-mono text-slate-400">
                          Passed: {sampleResults.passedCount} / {sampleResults.totalCount} sample tests
                        </span>
                      </div>

                      {sampleResults.stderr && (
                        <pre className="p-3 bg-rose-950/20 border border-rose-900/30 text-rose-300 rounded-lg font-mono">
                          {sampleResults.stderr}
                        </pre>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sampleResults.results?.map((res, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border font-mono space-y-1.5 ${
                              res.passed
                                ? 'bg-emerald-950/20 border-emerald-900/30'
                                : 'bg-rose-950/20 border-rose-900/30'
                            }`}
                          >
                            <div className="flex items-center justify-between font-sans">
                              <span className="font-semibold text-slate-200">Case {res.testCaseNumber}</span>
                              <span className={`text-[10px] font-bold ${res.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {res.passed ? 'PASSED' : res.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">Input: <span className="text-slate-300">{res.input}</span></div>
                            <div className="text-[11px] text-slate-400">Expected: <span className="text-slate-300">{res.expected}</span></div>
                            <div className="text-[11px]">Output: <span className={res.passed ? 'text-emerald-300' : 'text-rose-300'}>{res.actual || '(empty)'}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-slate-400">Click "Run Code" above to test against sample inputs:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {problem.sampleTestCases?.map((tc, idx) => (
                          <div key={tc.id} className="p-3 bg-[#080C14] border border-slate-800 rounded-xl font-mono space-y-1">
                            <span className="text-slate-400 font-sans font-semibold">Sample Case {idx + 1}</span>
                            <div className="text-[11px] text-slate-400">Input: <span className="text-slate-200">{tc.input}</span></div>
                            <div className="text-[11px] text-slate-400">Expected: <span className="text-slate-200">{tc.expected_output}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'custom_input' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400 text-xs">Standard Input (stdin):</span>
                    <button
                      onClick={handleRunCustom}
                      disabled={customRunning}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs transition-colors disabled:opacity-50"
                    >
                      {customRunning ? 'Executing...' : 'Run with Custom Stdin'}
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={customStdin}
                    onChange={(e) => setCustomStdin(e.target.value)}
                    placeholder="Enter standard input..."
                    className="w-full p-2.5 bg-[#080C14] border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                  {customResult && (
                    <div className="p-3 bg-[#080C14] border border-slate-800 rounded-xl space-y-2 font-mono">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={customResult.status} />
                        <span className="text-slate-500">{customResult.executionTime} ms</span>
                      </div>
                      {customResult.stderr && (
                        <pre className="text-rose-400 text-xs whitespace-pre-wrap">{customResult.stderr}</pre>
                      )}
                      {customResult.stdout && (
                        <pre className="text-slate-200 text-xs whitespace-pre-wrap">{customResult.stdout}</pre>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'submission_result' && (
                <div>
                  {submitting ? (
                    <div className="flex items-center justify-center p-8 gap-2 text-slate-400 font-mono">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Grading against all hidden test cases in Docker sandbox...
                    </div>
                  ) : submissionResult ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#080C14] border border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <StatusBadge status={submissionResult.status} />
                          <span className="text-sm font-semibold text-slate-200">
                            {submissionResult.passedTests} / {submissionResult.totalTests} Test Cases Passed
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400 font-mono text-xs">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {submissionResult.executionTime} ms
                          </span>
                          {submissionResult.memoryUsage > 0 && (
                            <span className="flex items-center gap-1">
                              <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                              {submissionResult.memoryUsage} MB
                            </span>
                          )}
                        </div>
                      </div>

                      {submissionResult.errorMessage && (
                        <div className="p-3 bg-rose-950/20 border border-rose-900/30 text-rose-300 rounded-xl font-mono">
                          <p className="font-semibold text-[11px] uppercase tracking-wider mb-1">Feedback:</p>
                          <p>{submissionResult.errorMessage}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-500 text-xs font-mono">
                      Click the "Submit" button above to evaluate your code against the full hidden test suite.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;
