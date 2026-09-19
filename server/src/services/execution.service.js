const { pool } = require('../config/db');
const { executeCode } = require('../execution/dockerEngine');

const executeUserCode = async ({ language, code, stdin = '', userId = null }) => {
  const result = await executeCode({ language, code, stdin });

  // Save to execution_history
  try {
    await pool.query(
      `INSERT INTO execution_history 
       (user_id, language, source_code, stdin, stdout, stderr, status, execution_time, memory_usage)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        language,
        code,
        stdin,
        result.stdout || '',
        result.stderr || '',
        result.status,
        result.executionTime || 0,
        result.memoryUsage || 0
      ]
    );
  } catch (err) {
    console.error('Failed to log execution history:', err.message);
  }

  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    executionTime: result.executionTime || 0,
    memoryUsage: result.memoryUsage || 0
  };
};

module.exports = {
  executeUserCode
};
