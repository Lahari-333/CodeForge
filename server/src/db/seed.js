const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const seedProblems = [
  {
    id: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    description: 'Given an array of integers `nums` and an integer `target`, return the 0-based indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nOutput the indices in ascending order separated by a single space.',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.',
    input_format: 'The first line contains an integer N (size of the array).\nThe second line contains N space-separated integers representing nums.\nThe third line contains an integer target.',
    output_format: 'Print the two 0-based indices separated by a space in ascending order (e.g. 0 1).',
    examples: [
      { input: '4\n2 7 11 15\n9', output: '0 1', explanation: 'nums[0] + nums[1] == 2 + 7 == 9, so indices are 0 and 1.' },
      { input: '3\n3 2 4\n6', output: '1 2', explanation: 'nums[1] + nums[2] == 2 + 4 == 6, so indices are 1 and 2.' }
    ],
    testCases: [
      { input: '4\n2 7 11 15\n9', expected_output: '0 1', is_sample: true },
      { input: '3\n3 2 4\n6', expected_output: '1 2', is_sample: true },
      { input: '2\n3 3\n6', expected_output: '0 1', is_sample: false },
      { input: '5\n1 5 3 7 9\n12', expected_output: '1 3', is_sample: false },
      { input: '6\n-3 4 3 90 2 1\n0', expected_output: '0 2', is_sample: false }
    ]
  },
  {
    id: 2,
    title: 'Reverse String',
    slug: 'reverse-string',
    description: 'Given a string `s`, output the string in reversed order.',
    difficulty: 'Easy',
    category: 'Strings',
    constraints: '1 <= s.length <= 10^5\nInput consists of printable ASCII characters.',
    input_format: 'A single line containing the string s.',
    output_format: 'Print the reversed string.',
    examples: [
      { input: 'hello', output: 'olleh', explanation: 'The reverse of hello is olleh.' },
      { input: 'CodeForge', output: 'egroFedoC', explanation: 'Reversing case-preserved characters.' }
    ],
    testCases: [
      { input: 'hello', expected_output: 'olleh', is_sample: true },
      { input: 'CodeForge', expected_output: 'egroFedoC', is_sample: true },
      { input: 'a', expected_output: 'a', is_sample: false },
      { input: 'racecar', expected_output: 'racecar', is_sample: false },
      { input: 'Docker Sandbox 2026', expected_output: '6202 xobdnaS rekcoD', is_sample: false }
    ]
  },
  {
    id: 3,
    title: 'Maximum Element',
    slug: 'maximum-element',
    description: 'Given an array of N integers, find and print the maximum element in the array.',
    difficulty: 'Easy',
    category: 'Arrays',
    constraints: '1 <= N <= 10^5\n-10^9 <= nums[i] <= 10^9',
    input_format: 'First line contains integer N.\nSecond line contains N space-separated integers.',
    output_format: 'Print the maximum integer found in the array.',
    examples: [
      { input: '5\n1 4 8 2 5', output: '8', explanation: 'The largest value in [1, 4, 8, 2, 5] is 8.' },
      { input: '3\n-10 -5 -20', output: '-5', explanation: 'The largest value is -5.' }
    ],
    testCases: [
      { input: '5\n1 4 8 2 5', expected_output: '8', is_sample: true },
      { input: '3\n-10 -5 -20', expected_output: '-5', is_sample: true },
      { input: '1\n42', expected_output: '42', is_sample: false },
      { input: '7\n99 12 45 99 3 45 8', expected_output: '99', is_sample: false },
      { input: '4\n-100 -200 -300 -50', expected_output: '-50', is_sample: false }
    ]
  },
  {
    id: 4,
    title: 'Palindrome Check',
    slug: 'palindrome-check',
    description: 'Given a string `s`, determine if it is a palindrome. A palindrome is a string that reads the same forwards and backwards. Comparison is case-sensitive.',
    difficulty: 'Easy',
    category: 'Strings',
    constraints: '1 <= s.length <= 10^5\nString contains alphanumeric characters.',
    input_format: 'A single line containing string s.',
    output_format: 'Print true if the string is a palindrome, otherwise print false.',
    examples: [
      { input: 'racecar', output: 'true', explanation: 'racecar reversed is racecar.' },
      { input: 'hello', output: 'false', explanation: 'hello reversed is olleh, which does not match.' }
    ],
    testCases: [
      { input: 'racecar', expected_output: 'true', is_sample: true },
      { input: 'hello', expected_output: 'false', is_sample: true },
      { input: 'madam', expected_output: 'true', is_sample: false },
      { input: '12321', expected_output: 'true', is_sample: false },
      { input: 'CodeForge', expected_output: 'false', is_sample: false }
    ]
  },
  {
    id: 5,
    title: 'Binary Search',
    slug: 'binary-search',
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its 0-based index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.',
    difficulty: 'Medium',
    category: 'Algorithms',
    constraints: '1 <= nums.length <= 10^5\n-10^9 <= nums[i], target <= 10^9\nAll the integers in nums are unique.\nnums is sorted in ascending order.',
    input_format: 'The first line contains integer N.\nThe second line contains N sorted space-separated integers.\nThe third line contains the target integer.',
    output_format: 'Print the 0-based index of target if present, otherwise -1.',
    examples: [
      { input: '6\n-1 0 3 5 9 12\n9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: '6\n-1 0 3 5 9 12\n2', output: '-1', explanation: '2 does not exist in nums so return -1.' }
    ],
    testCases: [
      { input: '6\n-1 0 3 5 9 12\n9', expected_output: '4', is_sample: true },
      { input: '6\n-1 0 3 5 9 12\n2', expected_output: '-1', is_sample: true },
      { input: '1\n5\n5', expected_output: '0', is_sample: false },
      { input: '5\n2 4 6 8 10\n10', expected_output: '4', is_sample: false },
      { input: '5\n2 4 6 8 10\n1', expected_output: '-1', is_sample: false }
    ]
  },
  {
    id: 6,
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input, sorted by starting position.',
    difficulty: 'Medium',
    category: 'Arrays',
    constraints: '1 <= intervals.length <= 10^4\nintervals[i].length == 2\n0 <= starti <= endi <= 10^4',
    input_format: 'First line contains integer N (number of intervals).\nThe next N lines each contain two space-separated integers start and end.',
    output_format: 'Print each merged interval on a new line as two space-separated integers (start end), sorted in ascending order of start time.',
    examples: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', output: '1 6\n8 10\n15 18', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
      { input: '2\n1 4\n4 5', output: '1 5', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' }
    ],
    testCases: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', expected_output: '1 6\n8 10\n15 18', is_sample: true },
      { input: '2\n1 4\n4 5', expected_output: '1 5', is_sample: true },
      { input: '3\n1 4\n0 4\n3 5', expected_output: '0 5', is_sample: false },
      { input: '3\n1 4\n2 3\n5 6', expected_output: '1 4\n5 6', is_sample: false },
      { input: '1\n2 8', expected_output: '2 8', is_sample: false }
    ]
  },
  {
    id: 7,
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    description: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    difficulty: 'Medium',
    category: 'Stack',
    constraints: '1 <= s.length <= 10^5\ns consists of parentheses only ()[]{}.',
    input_format: 'A single line containing the string s.',
    output_format: 'Print true if valid, or false if invalid.',
    examples: [
      { input: '()[]{}', output: 'true', explanation: 'All brackets are matched properly.' },
      { input: '(]', output: 'false', explanation: 'Mismatched closing bracket.' },
      { input: '([)]', output: 'false', explanation: 'Wrong nesting order.' }
    ],
    testCases: [
      { input: '()[]{}', expected_output: 'true', is_sample: true },
      { input: '(]', expected_output: 'false', is_sample: true },
      { input: '([)]', expected_output: 'false', is_sample: true },
      { input: '{[]}', expected_output: 'true', is_sample: false },
      { input: '((((()))))', expected_output: 'true', is_sample: false },
      { input: '[', expected_output: 'false', is_sample: false }
    ]
  },
  {
    id: 8,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'Medium',
    category: 'Strings',
    constraints: '0 <= s.length <= 5 * 10^4\ns consists of English letters, numbers, and symbols.',
    input_format: 'A single line containing the string s.',
    output_format: 'Print a single integer denoting the length of the longest non-repeating substring.',
    examples: [
      { input: 'abcabcbb', output: '3', explanation: 'The answer is "abc", with length of 3.' },
      { input: 'bbbbb', output: '1', explanation: 'The answer is "b", with length of 1.' },
      { input: 'pwwkew', output: '3', explanation: 'The answer is "wke", with length of 3.' }
    ],
    testCases: [
      { input: 'abcabcbb', expected_output: '3', is_sample: true },
      { input: 'bbbbb', expected_output: '1', is_sample: true },
      { input: 'pwwkew', expected_output: '3', is_sample: true },
      { input: 'abcdef', expected_output: '6', is_sample: false },
      { input: 'aab', expected_output: '2', is_sample: false },
      { input: 'dvdf', expected_output: '3', is_sample: false }
    ]
  },
  {
    id: 9,
    title: 'Longest Increasing Subsequence',
    slug: 'longest-increasing-subsequence',
    description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.\n\nA subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements.',
    difficulty: 'Hard',
    category: 'Dynamic Programming',
    constraints: '1 <= nums.length <= 2500\n-10^4 <= nums[i] <= 10^4',
    input_format: 'First line contains integer N.\nSecond line contains N space-separated integers.',
    output_format: 'Print a single integer representing the length of the longest strictly increasing subsequence.',
    examples: [
      { input: '8\n10 9 2 5 3 7 101 18', output: '4', explanation: 'The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4.' },
      { input: '6\n0 1 0 3 2 3', output: '4', explanation: 'The longest increasing subsequence is [0, 1, 2, 3], length 4.' },
      { input: '5\n7 7 7 7 7', output: '1', explanation: 'Strictly increasing means length 1.' }
    ],
    testCases: [
      { input: '8\n10 9 2 5 3 7 101 18', expected_output: '4', is_sample: true },
      { input: '6\n0 1 0 3 2 3', expected_output: '4', is_sample: true },
      { input: '5\n7 7 7 7 7', expected_output: '1', is_sample: true },
      { input: '4\n4 10 4 3 8 9', expected_output: '3', is_sample: false },
      { input: '1\n100', expected_output: '1', is_sample: false }
    ]
  },
  {
    id: 10,
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    difficulty: 'Hard',
    category: 'Arrays & Two Pointers',
    constraints: '1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5',
    input_format: 'First line contains integer N.\nSecond line contains N space-separated non-negative integers representing heights.',
    output_format: 'Print a single integer representing the total amount of water trapped.',
    examples: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', output: '6', explanation: 'The elevation map traps 6 units of rain water.' },
      { input: '6\n4 2 0 3 2 5', output: '9', explanation: 'The elevation map traps 9 units of rain water.' }
    ],
    testCases: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', expected_output: '6', is_sample: true },
      { input: '6\n4 2 0 3 2 5', expected_output: '9', is_sample: true },
      { input: '5\n3 0 0 2 0 4', expected_output: '10', is_sample: false },
      { input: '4\n3 2 1 0', expected_output: '0', is_sample: false },
      { input: '3\n0 1 0', expected_output: '0', is_sample: false }
    ]
  }
];

const seedDatabase = async () => {
  const connection = await pool.getConnection();
  try {
    console.log('Seeding CodeForge database...');

    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE test_cases');
    await connection.query('TRUNCATE TABLE submissions');
    await connection.query('TRUNCATE TABLE execution_history');
    await connection.query('TRUNCATE TABLE problems');
    await connection.query('TRUNCATE TABLE users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // 1. Seed Users
    const adminPasswordHash = bcrypt.hashSync('AdminPassword@123', 10);
    const demoPasswordHash = bcrypt.hashSync('DemoPassword@123', 10);

    await connection.query(
      'INSERT INTO users (id, name, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
      [1, 'System Admin', 'admin', 'admin@codeforge.dev', adminPasswordHash, 'ADMIN']
    );

    await connection.query(
      'INSERT INTO users (id, name, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
      [2, 'Demo Developer', 'demouser', 'demo@codeforge.dev', demoPasswordHash, 'USER']
    );

    console.log('Users seeded: admin, demouser');

    // 2. Seed Problems and Test Cases
    for (const prob of seedProblems) {
      await connection.query(
        `INSERT INTO problems (id, title, slug, description, difficulty, category, constraints, input_format, output_format, examples, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prob.id,
          prob.title,
          prob.slug,
          prob.description,
          prob.difficulty,
          prob.category,
          prob.constraints,
          prob.input_format,
          prob.output_format,
          JSON.stringify(prob.examples),
          1
        ]
      );

      for (const tc of prob.testCases) {
        await connection.query(
          `INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
           VALUES (?, ?, ?, ?)`,
          [prob.id, tc.input, tc.expected_output, tc.is_sample]
        );
      }
    }

    console.log(`Problems seeded: ${seedProblems.length} problems with test cases.`);

    // Also update root seed.sql with executable format
    let sqlDump = `-- CodeForge Seed Data\nUSE \`codeforge_db\`;\n\nSET FOREIGN_KEY_CHECKS = 0;\nTRUNCATE TABLE \`test_cases\`;\nTRUNCATE TABLE \`submissions\`;\nTRUNCATE TABLE \`execution_history\`;\nTRUNCATE TABLE \`problems\`;\nTRUNCATE TABLE \`users\`;\nSET FOREIGN_KEY_CHECKS = 1;\n\n`;
    
    sqlDump += `INSERT INTO \`users\` (\`id\`, \`name\`, \`username\`, \`email\`, \`password_hash\`, \`role\`) VALUES\n` +
      `(1, 'System Admin', 'admin', 'admin@codeforge.dev', '${adminPasswordHash}', 'ADMIN'),\n` +
      `(2, 'Demo Developer', 'demouser', 'demo@codeforge.dev', '${demoPasswordHash}', 'USER');\n\n`;

    for (const prob of seedProblems) {
      const escapedDesc = prob.description.replace(/'/g, "''");
      const escapedConstraints = (prob.constraints || '').replace(/'/g, "''");
      const escapedInputFmt = (prob.input_format || '').replace(/'/g, "''");
      const escapedOutputFmt = (prob.output_format || '').replace(/'/g, "''");
      const examplesJson = JSON.stringify(prob.examples).replace(/'/g, "''");

      sqlDump += `INSERT INTO \`problems\` (\`id\`, \`title\`, \`slug\`, \`description\`, \`difficulty\`, \`category\`, \`constraints\`, \`input_format\`, \`output_format\`, \`examples\`, \`created_by\`) VALUES\n` +
        `(${prob.id}, '${prob.title}', '${prob.slug}', '${escapedDesc}', '${prob.difficulty}', '${prob.category}', '${escapedConstraints}', '${escapedInputFmt}', '${escapedOutputFmt}', '${examplesJson}', 1);\n\n`;

      for (const tc of prob.testCases) {
        const escInput = tc.input.replace(/'/g, "''");
        const escOutput = tc.expected_output.replace(/'/g, "''");
        sqlDump += `INSERT INTO \`test_cases\` (\`problem_id\`, \`input\`, \`expected_output\`, \`is_sample\`) VALUES (${prob.id}, '${escInput}', '${escOutput}', ${tc.is_sample ? 'TRUE' : 'FALSE'});\n`;
      }
      sqlDump += '\n';
    }

    fs.writeFileSync(path.join(__dirname, '../../../seed.sql'), sqlDump, 'utf8');
    console.log('Updated root seed.sql successfully.');

    return true;
  } catch (error) {
    console.error('Error during database seeding:', error);
    throw error;
  } finally {
    connection.release();
  }
};

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Database seeding finished successfully!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = { seedDatabase, seedProblems };
