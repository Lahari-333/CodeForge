const { pool } = require('../config/db');

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const getAllProblems = async ({
  search = '',
  difficulty = '',
  category = '',
  page = 1,
  limit = 10,
  userId = null
}) => {
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];

  if (search && search.trim()) {
    conditions.push('(p.title LIKE ? OR p.category LIKE ?)');
    params.push(`%${search.trim()}%`, `%${search.trim()}%`);
  }

  if (difficulty && difficulty !== 'All') {
    conditions.push('p.difficulty = ?');
    params.push(difficulty);
  }

  if (category && category !== 'All') {
    conditions.push('p.category = ?');
    params.push(category);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Get total count
  const [countResult] = await pool.query(
    `SELECT COUNT(*) as total FROM problems p ${whereClause}`,
    params
  );
  const total = countResult[0].total;

  // Get problems list
  let query = '';
  let queryParams = [];

  if (userId) {
    query = `
      SELECT 
        p.id, p.title, p.slug, p.difficulty, p.category, p.created_at,
        EXISTS (
          SELECT 1 FROM submissions s 
          WHERE s.problem_id = p.id AND s.user_id = ? AND s.status = 'ACCEPTED'
        ) AS is_solved
      FROM problems p
      ${whereClause}
      ORDER BY p.id ASC
      LIMIT ? OFFSET ?
    `;
    queryParams = [userId, ...params, limit, offset];
  } else {
    query = `
      SELECT 
        p.id, p.title, p.slug, p.difficulty, p.category, p.created_at,
        0 AS is_solved
      FROM problems p
      ${whereClause}
      ORDER BY p.id ASC
      LIMIT ? OFFSET ?
    `;
    queryParams = [...params, limit, offset];
  }

  const [problems] = await pool.query(query, queryParams);

  // Get unique categories for filters
  const [categoriesResult] = await pool.query(
    'SELECT DISTINCT category FROM problems ORDER BY category ASC'
  );
  const categories = categoriesResult.map(c => c.category);

  return {
    problems: problems.map(p => ({
      ...p,
      is_solved: Boolean(p.is_solved)
    })),
    categories,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getProblemBySlug = async (slug, userId = null) => {
  const [problems] = await pool.query(
    'SELECT * FROM problems WHERE slug = ?',
    [slug]
  );

  if (problems.length === 0) {
    const error = new Error('Problem not found.');
    error.statusCode = 404;
    throw error;
  }

  const problem = problems[0];

  // Load ONLY sample test cases for user solving/testing
  const [sampleTestCases] = await pool.query(
    'SELECT id, input, expected_output, is_sample FROM test_cases WHERE problem_id = ? AND is_sample = TRUE ORDER BY id ASC',
    [problem.id]
  );

  let isSolved = false;
  if (userId) {
    const [solved] = await pool.query(
      'SELECT 1 FROM submissions WHERE problem_id = ? AND user_id = ? AND status = "ACCEPTED" LIMIT 1',
      [problem.id, userId]
    );
    isSolved = solved.length > 0;
  }

  let examplesParsed = [];
  try {
    examplesParsed = typeof problem.examples === 'string' ? JSON.parse(problem.examples) : problem.examples || [];
  } catch (e) {
    examplesParsed = [];
  }

  return {
    id: problem.id,
    title: problem.title,
    slug: problem.slug,
    description: problem.description,
    difficulty: problem.difficulty,
    category: problem.category,
    constraints: problem.constraints,
    input_format: problem.input_format,
    output_format: problem.output_format,
    examples: examplesParsed,
    sampleTestCases,
    isSolved,
    created_at: problem.created_at
  };
};

const createProblem = async ({
  title,
  description,
  difficulty,
  category,
  constraints,
  input_format,
  output_format,
  examples = [],
  test_cases = [],
  created_by = null
}) => {
  let slug = generateSlug(title);

  // Verify slug uniqueness
  const [existingSlug] = await pool.query('SELECT id FROM problems WHERE slug = ?', [slug]);
  if (existingSlug.length > 0) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO problems 
       (title, slug, description, difficulty, category, constraints, input_format, output_format, examples, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        description,
        difficulty,
        category,
        constraints || null,
        input_format || null,
        output_format || null,
        JSON.stringify(examples),
        created_by
      ]
    );

    const problemId = result.insertId;

    if (Array.isArray(test_cases) && test_cases.length > 0) {
      for (const tc of test_cases) {
        await connection.query(
          `INSERT INTO test_cases (problem_id, input, expected_output, is_sample) VALUES (?, ?, ?, ?)`,
          [problemId, tc.input, tc.expected_output, Boolean(tc.is_sample)]
        );
      }
    }

    await connection.commit();

    return {
      id: problemId,
      title,
      slug,
      difficulty,
      category
    };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const updateProblem = async (problemId, data) => {
  const {
    title,
    description,
    difficulty,
    category,
    constraints,
    input_format,
    output_format,
    examples
  } = data;

  const [existing] = await pool.query('SELECT id FROM problems WHERE id = ?', [problemId]);
  if (existing.length === 0) {
    const error = new Error('Problem not found.');
    error.statusCode = 404;
    throw error;
  }

  const updates = [];
  const params = [];

  if (title) {
    updates.push('title = ?');
    params.push(title);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    params.push(description);
  }
  if (difficulty) {
    updates.push('difficulty = ?');
    params.push(difficulty);
  }
  if (category) {
    updates.push('category = ?');
    params.push(category);
  }
  if (constraints !== undefined) {
    updates.push('constraints = ?');
    params.push(constraints);
  }
  if (input_format !== undefined) {
    updates.push('input_format = ?');
    params.push(input_format);
  }
  if (output_format !== undefined) {
    updates.push('output_format = ?');
    params.push(output_format);
  }
  if (examples !== undefined) {
    updates.push('examples = ?');
    params.push(JSON.stringify(examples));
  }

  if (updates.length > 0) {
    params.push(problemId);
    await pool.query(
      `UPDATE problems SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
  }

  return { success: true, message: 'Problem updated successfully.' };
};

const deleteProblem = async (problemId) => {
  const [result] = await pool.query('DELETE FROM problems WHERE id = ?', [problemId]);
  if (result.affectedRows === 0) {
    const error = new Error('Problem not found.');
    error.statusCode = 404;
    throw error;
  }
  return { success: true, message: 'Problem deleted successfully.' };
};

const getAdminTestCases = async (problemId) => {
  const [testCases] = await pool.query(
    'SELECT id, problem_id, input, expected_output, is_sample, created_at FROM test_cases WHERE problem_id = ? ORDER BY id ASC',
    [problemId]
  );
  return testCases;
};

const addTestCase = async (problemId, { input, expected_output, is_sample = false }) => {
  const [result] = await pool.query(
    'INSERT INTO test_cases (problem_id, input, expected_output, is_sample) VALUES (?, ?, ?, ?)',
    [problemId, input, expected_output, Boolean(is_sample)]
  );
  return {
    id: result.insertId,
    problem_id: problemId,
    input,
    expected_output,
    is_sample: Boolean(is_sample)
  };
};

const updateTestCase = async (testCaseId, { input, expected_output, is_sample }) => {
  const [result] = await pool.query(
    'UPDATE test_cases SET input = ?, expected_output = ?, is_sample = ? WHERE id = ?',
    [input, expected_output, Boolean(is_sample), testCaseId]
  );
  if (result.affectedRows === 0) {
    const error = new Error('Test case not found.');
    error.statusCode = 404;
    throw error;
  }
  return { success: true, message: 'Test case updated successfully.' };
};

const deleteTestCase = async (testCaseId) => {
  const [result] = await pool.query('DELETE FROM test_cases WHERE id = ?', [testCaseId]);
  if (result.affectedRows === 0) {
    const error = new Error('Test case not found.');
    error.statusCode = 404;
    throw error;
  }
  return { success: true, message: 'Test case deleted successfully.' };
};

module.exports = {
  getAllProblems,
  getProblemBySlug,
  createProblem,
  updateProblem,
  deleteProblem,
  getAdminTestCases,
  addTestCase,
  updateTestCase,
  deleteTestCase
};
