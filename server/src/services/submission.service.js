const { pool } = require('../config/db');
const { executeCode } = require('../execution/dockerEngine');
const { compareOutputs } = require('../utils/outputNormalizer');
const { EXECUTION_STATUS } = require('../config/constants');

const runSampleTests = async ({ problemId, language, code }) => {
  const [testCases] = await pool.query(
    'SELECT id, input, expected_output FROM test_cases WHERE problem_id = ? AND is_sample = TRUE ORDER BY id ASC',
    [problemId]
  );

  if (testCases.length === 0) {
    const error = new Error('No sample test cases found for this problem.');
    error.statusCode = 404;
    throw error;
  }

  const results = [];
  let passedCount = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const execRes = await executeCode({ language, code, stdin: tc.input });

    if (execRes.status === EXECUTION_STATUS.COMPILATION_ERROR) {
      // If compilation fails, return compilation error for the entire run
      return {
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        status: EXECUTION_STATUS.COMPILATION_ERROR,
        stderr: execRes.stderr,
        results: [
          {
            testCaseNumber: i + 1,
            status: EXECUTION_STATUS.COMPILATION_ERROR,
            error: execRes.stderr
          }
        ]
      };
    }

    if (execRes.status === EXECUTION_STATUS.SYSTEM_ERROR) {
      return {
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        status: EXECUTION_STATUS.SYSTEM_ERROR,
        stderr: execRes.stderr,
        results: []
      };
    }

    const isMatch = execRes.status === EXECUTION_STATUS.SUCCESS && compareOutputs(execRes.stdout, tc.expected_output);
    const caseStatus = !isMatch && execRes.status === EXECUTION_STATUS.SUCCESS
      ? EXECUTION_STATUS.WRONG_ANSWER
      : execRes.status;

    if (isMatch) {
      passedCount++;
    }

    results.push({
      testCaseNumber: i + 1,
      input: tc.input,
      expected: tc.expected_output,
      actual: execRes.stdout,
      stderr: execRes.stderr,
      passed: isMatch,
      status: caseStatus,
      executionTime: execRes.executionTime,
      memoryUsage: execRes.memoryUsage
    });
  }

  const allPassed = passedCount === testCases.length;

  return {
    allPassed,
    passedCount,
    totalCount: testCases.length,
    status: allPassed ? EXECUTION_STATUS.ACCEPTED : EXECUTION_STATUS.WRONG_ANSWER,
    results
  };
};

const submitSolution = async ({ userId, problemId, language, code }) => {
  const [problem] = await pool.query('SELECT id, title FROM problems WHERE id = ?', [problemId]);
  if (problem.length === 0) {
    const error = new Error('Problem not found.');
    error.statusCode = 404;
    throw error;
  }

  // Load all test cases
  const [testCases] = await pool.query(
    'SELECT id, input, expected_output, is_sample FROM test_cases WHERE problem_id = ? ORDER BY is_sample DESC, id ASC',
    [problemId]
  );

  if (testCases.length === 0) {
    const error = new Error('No test cases configured for this problem.');
    error.statusCode = 400;
    throw error;
  }

  let passedTests = 0;
  let totalTime = 0;
  let maxMemory = 0;
  let finalStatus = EXECUTION_STATUS.ACCEPTED;
  let errorMessage = null;
  let failedTestCaseIndex = null;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const execRes = await executeCode({ language, code, stdin: tc.input });

    totalTime += execRes.executionTime || 0;
    if ((execRes.memoryUsage || 0) > maxMemory) {
      maxMemory = execRes.memoryUsage;
    }

    if (execRes.status === EXECUTION_STATUS.SYSTEM_ERROR) {
      finalStatus = EXECUTION_STATUS.SYSTEM_ERROR;
      errorMessage = execRes.stderr;
      break;
    }

    if (execRes.status === EXECUTION_STATUS.COMPILATION_ERROR) {
      finalStatus = EXECUTION_STATUS.COMPILATION_ERROR;
      errorMessage = execRes.stderr;
      break;
    }

    if (execRes.status === EXECUTION_STATUS.TIME_LIMIT_EXCEEDED) {
      finalStatus = EXECUTION_STATUS.TIME_LIMIT_EXCEEDED;
      errorMessage = execRes.stderr;
      failedTestCaseIndex = i + 1;
      break;
    }

    if (execRes.status === EXECUTION_STATUS.MEMORY_LIMIT_EXCEEDED) {
      finalStatus = EXECUTION_STATUS.MEMORY_LIMIT_EXCEEDED;
      errorMessage = execRes.stderr;
      failedTestCaseIndex = i + 1;
      break;
    }

    if (execRes.status === EXECUTION_STATUS.OUTPUT_LIMIT_EXCEEDED) {
      finalStatus = EXECUTION_STATUS.OUTPUT_LIMIT_EXCEEDED;
      errorMessage = execRes.stderr;
      failedTestCaseIndex = i + 1;
      break;
    }

    if (execRes.status === EXECUTION_STATUS.RUNTIME_ERROR) {
      finalStatus = EXECUTION_STATUS.RUNTIME_ERROR;
      errorMessage = execRes.stderr;
      failedTestCaseIndex = i + 1;
      break;
    }

    // Success exit code: check output match
    const isMatch = compareOutputs(execRes.stdout, tc.expected_output);
    if (isMatch) {
      passedTests++;
    } else {
      finalStatus = EXECUTION_STATUS.WRONG_ANSWER;
      failedTestCaseIndex = i + 1;
      // If it is a sample test case, we can provide feedback; if hidden, we only state test index failed
      if (tc.is_sample) {
        errorMessage = `Failed on sample test case ${i + 1}. Expected: "${tc.expected_output}", Actual: "${execRes.stdout.trim()}"`;
      } else {
        errorMessage = `Failed on test case ${i + 1}.`;
      }
      break;
    }
  }

  const avgTime = passedTests > 0 ? Math.round(totalTime / (failedTestCaseIndex || testCases.length)) : totalTime;

  // Insert submission
  const [insertResult] = await pool.query(
    `INSERT INTO submissions 
     (user_id, problem_id, language, source_code, status, execution_time, memory_usage, passed_tests, total_tests, error_message)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      problemId,
      language,
      code,
      finalStatus,
      avgTime,
      maxMemory,
      passedTests,
      testCases.length,
      errorMessage
    ]
  );

  return {
    id: insertResult.insertId,
    status: finalStatus,
    executionTime: avgTime,
    memoryUsage: maxMemory,
    passedTests,
    totalTests: testCases.length,
    errorMessage,
    failedTestCaseIndex
  };
};

const getUserSubmissions = async ({ userId, page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const [countResult] = await pool.query(
    'SELECT COUNT(*) as total FROM submissions WHERE user_id = ?',
    [userId]
  );
  const total = countResult[0].total;

  const [submissions] = await pool.query(
    `SELECT 
       s.id, s.problem_id, s.language, s.status, s.execution_time, s.memory_usage,
       s.passed_tests, s.total_tests, s.created_at,
       p.title AS problem_title, p.slug AS problem_slug, p.difficulty
     FROM submissions s
     JOIN problems p ON s.problem_id = p.id
     WHERE s.user_id = ?
     ORDER BY s.created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );

  return {
    submissions,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getSubmissionById = async ({ submissionId, userId, userRole }) => {
  const [submissions] = await pool.query(
    `SELECT 
       s.*, p.title AS problem_title, p.slug AS problem_slug, p.difficulty, u.username
     FROM submissions s
     JOIN problems p ON s.problem_id = p.id
     JOIN users u ON s.user_id = u.id
     WHERE s.id = ?`,
    [submissionId]
  );

  if (submissions.length === 0) {
    const error = new Error('Submission not found.');
    error.statusCode = 404;
    throw error;
  }

  const sub = submissions[0];

  // Authorization check: only owner or ADMIN can view source code
  if (sub.user_id !== userId && userRole !== 'ADMIN') {
    const error = new Error('Access denied. You can only view your own submissions.');
    error.statusCode = 403;
    throw error;
  }

  return sub;
};

module.exports = {
  runSampleTests,
  submitSolution,
  getUserSubmissions,
  getSubmissionById
};
