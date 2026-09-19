const { pool } = require('../config/db');

const getUserProfile = async (userId) => {
  const [users] = await pool.query(
    'SELECT id, name, username, email, role, created_at FROM users WHERE id = ?',
    [userId]
  );

  if (users.length === 0) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const user = users[0];

  // Overall platform problem counts
  const [problemCounts] = await pool.query(`
    SELECT 
      COUNT(*) AS total_problems,
      SUM(CASE WHEN difficulty = 'Easy' THEN 1 ELSE 0 END) AS total_easy,
      SUM(CASE WHEN difficulty = 'Medium' THEN 1 ELSE 0 END) AS total_medium,
      SUM(CASE WHEN difficulty = 'Hard' THEN 1 ELSE 0 END) AS total_hard
    FROM problems
  `);

  // Solved problems count by difficulty
  const [solvedCounts] = await pool.query(`
    SELECT 
      COUNT(DISTINCT p.id) AS solved_total,
      COUNT(DISTINCT CASE WHEN p.difficulty = 'Easy' THEN p.id END) AS solved_easy,
      COUNT(DISTINCT CASE WHEN p.difficulty = 'Medium' THEN p.id END) AS solved_medium,
      COUNT(DISTINCT CASE WHEN p.difficulty = 'Hard' THEN p.id END) AS solved_hard
    FROM submissions s
    JOIN problems p ON s.problem_id = p.id
    WHERE s.user_id = ? AND s.status = 'ACCEPTED'
  `, [userId]);

  // Submission statistics
  const [submissionStats] = await pool.query(`
    SELECT 
      COUNT(*) AS total_submissions,
      SUM(CASE WHEN status = 'ACCEPTED' THEN 1 ELSE 0 END) AS accepted_submissions
    FROM submissions
    WHERE user_id = ?
  `, [userId]);

  const totalSubmissions = Number(submissionStats[0].total_submissions || 0);
  const acceptedSubmissions = Number(submissionStats[0].accepted_submissions || 0);
  const acceptanceRate = totalSubmissions > 0
    ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
    : 0;

  // Language breakdown
  const [languagesUsed] = await pool.query(`
    SELECT language, COUNT(*) AS count
    FROM submissions
    WHERE user_id = ?
    GROUP BY language
  `, [userId]);

  return {
    user,
    stats: {
      totalSolved: Number(solvedCounts[0].solved_total || 0),
      totalProblems: Number(problemCounts[0].total_problems || 0),
      solvedEasy: Number(solvedCounts[0].solved_easy || 0),
      totalEasy: Number(problemCounts[0].total_easy || 0),
      solvedMedium: Number(solvedCounts[0].solved_medium || 0),
      totalMedium: Number(problemCounts[0].total_medium || 0),
      solvedHard: Number(solvedCounts[0].solved_hard || 0),
      totalHard: Number(problemCounts[0].total_hard || 0),
      totalSubmissions,
      acceptedSubmissions,
      acceptanceRate,
      languagesUsed
    }
  };
};

const getDashboardStats = async (userId) => {
  const profileData = await getUserProfile(userId);

  // Recent 5 submissions
  const [recentSubmissions] = await pool.query(`
    SELECT 
      s.id, s.language, s.status, s.execution_time, s.created_at,
      p.title AS problem_title, p.slug AS problem_slug, p.difficulty
    FROM submissions s
    JOIN problems p ON s.problem_id = p.id
    WHERE s.user_id = ?
    ORDER BY s.created_at DESC
    LIMIT 5
  `, [userId]);

  // Recommended problems (not yet solved by this user)
  const [recommendedProblems] = await pool.query(`
    SELECT p.id, p.title, p.slug, p.difficulty, p.category
    FROM problems p
    WHERE p.id NOT IN (
      SELECT problem_id FROM submissions WHERE user_id = ? AND status = 'ACCEPTED'
    )
    ORDER BY FIELD(p.difficulty, 'Easy', 'Medium', 'Hard'), p.id ASC
    LIMIT 4
  `, [userId]);

  // Activity breakdown for the last 7 days for charts
  const [activityData] = await pool.query(`
    SELECT 
      DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'ACCEPTED' THEN 1 ELSE 0 END) AS accepted
    FROM submissions
    WHERE user_id = ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
    ORDER BY date ASC
  `, [userId]);

  return {
    stats: profileData.stats,
    user: profileData.user,
    recentSubmissions,
    recommendedProblems,
    activityData
  };
};

module.exports = {
  getUserProfile,
  getDashboardStats
};
