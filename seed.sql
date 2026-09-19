-- CodeForge Seed Data
USE `codeforge_db`;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `test_cases`;
TRUNCATE TABLE `submissions`;
TRUNCATE TABLE `execution_history`;
TRUNCATE TABLE `problems`;
TRUNCATE TABLE `users`;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `role`) VALUES
(1, 'System Admin', 'admin', 'admin@codeforge.dev', '$2a$10$vnpXCbPRHoyfdz3VnRLdsurza2gzZXYhWdUCdztGR.77y2goM7xVG', 'ADMIN'),
(2, 'Demo Developer', 'demouser', 'demo@codeforge.dev', '$2a$10$BrY2vYbWXIPnS97KPiX4C.0qo7jf3wcxxYcaf5JiPML18RSoa0h7O', 'USER');

INSERT INTO `problems` (`id`, `title`, `slug`, `description`, `difficulty`, `category`, `constraints`, `input_format`, `output_format`, `examples`, `created_by`) VALUES
(1, 'Two Sum', 'two-sum', 'Given an array of integers `nums` and an integer `target`, return the 0-based indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Output the indices in ascending order separated by a single space.', 'Easy', 'Arrays & Hashing', '2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9
Only one valid answer exists.', 'The first line contains an integer N (size of the array).
The second line contains N space-separated integers representing nums.
The third line contains an integer target.', 'Print the two 0-based indices separated by a space in ascending order (e.g. 0 1).', '[{"input":"4\n2 7 11 15\n9","output":"0 1","explanation":"nums[0] + nums[1] == 2 + 7 == 9, so indices are 0 and 1."},{"input":"3\n3 2 4\n6","output":"1 2","explanation":"nums[1] + nums[2] == 2 + 4 == 6, so indices are 1 and 2."}]', 1);

INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (1, '4
2 7 11 15
9', '0 1', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (1, '3
3 2 4
6', '1 2', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (1, '2
3 3
6', '0 1', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (1, '5
1 5 3 7 9
12', '1 3', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (1, '6
-3 4 3 90 2 1
0', '0 2', FALSE);

INSERT INTO `problems` (`id`, `title`, `slug`, `description`, `difficulty`, `category`, `constraints`, `input_format`, `output_format`, `examples`, `created_by`) VALUES
(2, 'Reverse String', 'reverse-string', 'Given a string `s`, output the string in reversed order.', 'Easy', 'Strings', '1 <= s.length <= 10^5
Input consists of printable ASCII characters.', 'A single line containing the string s.', 'Print the reversed string.', '[{"input":"hello","output":"olleh","explanation":"The reverse of hello is olleh."},{"input":"CodeForge","output":"egroFedoC","explanation":"Reversing case-preserved characters."}]', 1);

INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (2, 'hello', 'olleh', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (2, 'CodeForge', 'egroFedoC', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (2, 'a', 'a', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (2, 'racecar', 'racecar', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (2, 'Docker Sandbox 2026', '6202 xobdnaS rekcoD', FALSE);

INSERT INTO `problems` (`id`, `title`, `slug`, `description`, `difficulty`, `category`, `constraints`, `input_format`, `output_format`, `examples`, `created_by`) VALUES
(3, 'Maximum Element', 'maximum-element', 'Given an array of N integers, find and print the maximum element in the array.', 'Easy', 'Arrays', '1 <= N <= 10^5
-10^9 <= nums[i] <= 10^9', 'First line contains integer N.
Second line contains N space-separated integers.', 'Print the maximum integer found in the array.', '[{"input":"5\n1 4 8 2 5","output":"8","explanation":"The largest value in [1, 4, 8, 2, 5] is 8."},{"input":"3\n-10 -5 -20","output":"-5","explanation":"The largest value is -5."}]', 1);

INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (3, '5
1 4 8 2 5', '8', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (3, '3
-10 -5 -20', '-5', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (3, '1
42', '42', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (3, '7
99 12 45 99 3 45 8', '99', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (3, '4
-100 -200 -300 -50', '-50', FALSE);

INSERT INTO `problems` (`id`, `title`, `slug`, `description`, `difficulty`, `category`, `constraints`, `input_format`, `output_format`, `examples`, `created_by`) VALUES
(4, 'Palindrome Check', 'palindrome-check', 'Given a string `s`, determine if it is a palindrome. A palindrome is a string that reads the same forwards and backwards. Comparison is case-sensitive.', 'Easy', 'Strings', '1 <= s.length <= 10^5
String contains alphanumeric characters.', 'A single line containing string s.', 'Print true if the string is a palindrome, otherwise print false.', '[{"input":"racecar","output":"true","explanation":"racecar reversed is racecar."},{"input":"hello","output":"false","explanation":"hello reversed is olleh, which does not match."}]', 1);

INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (4, 'racecar', 'true', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (4, 'hello', 'false', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (4, 'madam', 'true', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (4, '12321', 'true', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (4, 'CodeForge', 'false', FALSE);

INSERT INTO `problems` (`id`, `title`, `slug`, `description`, `difficulty`, `category`, `constraints`, `input_format`, `output_format`, `examples`, `created_by`) VALUES
(5, 'Binary Search', 'binary-search', 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its 0-based index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.', 'Medium', 'Algorithms', '1 <= nums.length <= 10^5
-10^9 <= nums[i], target <= 10^9
All the integers in nums are unique.
nums is sorted in ascending order.', 'The first line contains integer N.
The second line contains N sorted space-separated integers.
The third line contains the target integer.', 'Print the 0-based index of target if present, otherwise -1.', '[{"input":"6\n-1 0 3 5 9 12\n9","output":"4","explanation":"9 exists in nums and its index is 4."},{"input":"6\n-1 0 3 5 9 12\n2","output":"-1","explanation":"2 does not exist in nums so return -1."}]', 1);

INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (5, '6
-1 0 3 5 9 12
9', '4', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (5, '6
-1 0 3 5 9 12
2', '-1', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (5, '1
5
5', '0', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (5, '5
2 4 6 8 10
10', '4', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (5, '5
2 4 6 8 10
1', '-1', FALSE);

INSERT INTO `problems` (`id`, `title`, `slug`, `description`, `difficulty`, `category`, `constraints`, `input_format`, `output_format`, `examples`, `created_by`) VALUES
(6, 'Merge Intervals', 'merge-intervals', 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input, sorted by starting position.', 'Medium', 'Arrays', '1 <= intervals.length <= 10^4
intervals[i].length == 2
0 <= starti <= endi <= 10^4', 'First line contains integer N (number of intervals).
The next N lines each contain two space-separated integers start and end.', 'Print each merged interval on a new line as two space-separated integers (start end), sorted in ascending order of start time.', '[{"input":"4\n1 3\n2 6\n8 10\n15 18","output":"1 6\n8 10\n15 18","explanation":"Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."},{"input":"2\n1 4\n4 5","output":"1 5","explanation":"Intervals [1,4] and [4,5] are considered overlapping."}]', 1);

INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (6, '4
1 3
2 6
8 10
15 18', '1 6
8 10
15 18', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (6, '2
1 4
4 5', '1 5', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (6, '3
1 4
0 4
3 5', '0 5', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (6, '3
1 4
2 3
5 6', '1 4
5 6', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (6, '1
2 8', '2 8', FALSE);

INSERT INTO `problems` (`id`, `title`, `slug`, `description`, `difficulty`, `category`, `constraints`, `input_format`, `output_format`, `examples`, `created_by`) VALUES
(7, 'Valid Parentheses', 'valid-parentheses', 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.', 'Medium', 'Stack', '1 <= s.length <= 10^5
s consists of parentheses only ()[]{}.', 'A single line containing the string s.', 'Print true if valid, or false if invalid.', '[{"input":"()[]{}","output":"true","explanation":"All brackets are matched properly."},{"input":"(]","output":"false","explanation":"Mismatched closing bracket."},{"input":"([)]","output":"false","explanation":"Wrong nesting order."}]', 1);

INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (7, '()[]{}', 'true', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (7, '(]', 'false', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (7, '([)]', 'false', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (7, '{[]}', 'true', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (7, '((((()))))', 'true', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (7, '[', 'false', FALSE);

INSERT INTO `problems` (`id`, `title`, `slug`, `description`, `difficulty`, `category`, `constraints`, `input_format`, `output_format`, `examples`, `created_by`) VALUES
(8, 'Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Given a string s, find the length of the longest substring without repeating characters.', 'Medium', 'Strings', '0 <= s.length <= 5 * 10^4
s consists of English letters, numbers, and symbols.', 'A single line containing the string s.', 'Print a single integer denoting the length of the longest non-repeating substring.', '[{"input":"abcabcbb","output":"3","explanation":"The answer is \"abc\", with length of 3."},{"input":"bbbbb","output":"1","explanation":"The answer is \"b\", with length of 1."},{"input":"pwwkew","output":"3","explanation":"The answer is \"wke\", with length of 3."}]', 1);

INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (8, 'abcabcbb', '3', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (8, 'bbbbb', '1', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (8, 'pwwkew', '3', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (8, 'abcdef', '6', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (8, 'aab', '2', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (8, 'dvdf', '3', FALSE);

INSERT INTO `problems` (`id`, `title`, `slug`, `description`, `difficulty`, `category`, `constraints`, `input_format`, `output_format`, `examples`, `created_by`) VALUES
(9, 'Longest Increasing Subsequence', 'longest-increasing-subsequence', 'Given an integer array nums, return the length of the longest strictly increasing subsequence.

A subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements.', 'Hard', 'Dynamic Programming', '1 <= nums.length <= 2500
-10^4 <= nums[i] <= 10^4', 'First line contains integer N.
Second line contains N space-separated integers.', 'Print a single integer representing the length of the longest strictly increasing subsequence.', '[{"input":"8\n10 9 2 5 3 7 101 18","output":"4","explanation":"The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4."},{"input":"6\n0 1 0 3 2 3","output":"4","explanation":"The longest increasing subsequence is [0, 1, 2, 3], length 4."},{"input":"5\n7 7 7 7 7","output":"1","explanation":"Strictly increasing means length 1."}]', 1);

INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (9, '8
10 9 2 5 3 7 101 18', '4', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (9, '6
0 1 0 3 2 3', '4', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (9, '5
7 7 7 7 7', '1', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (9, '4
4 10 4 3 8 9', '3', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (9, '1
100', '1', FALSE);

INSERT INTO `problems` (`id`, `title`, `slug`, `description`, `difficulty`, `category`, `constraints`, `input_format`, `output_format`, `examples`, `created_by`) VALUES
(10, 'Trapping Rain Water', 'trapping-rain-water', 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.', 'Hard', 'Arrays & Two Pointers', '1 <= n <= 2 * 10^4
0 <= height[i] <= 10^5', 'First line contains integer N.
Second line contains N space-separated non-negative integers representing heights.', 'Print a single integer representing the total amount of water trapped.', '[{"input":"12\n0 1 0 2 1 0 1 3 2 1 2 1","output":"6","explanation":"The elevation map traps 6 units of rain water."},{"input":"6\n4 2 0 3 2 5","output":"9","explanation":"The elevation map traps 9 units of rain water."}]', 1);

INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (10, '12
0 1 0 2 1 0 1 3 2 1 2 1', '6', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (10, '6
4 2 0 3 2 5', '9', TRUE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (10, '5
3 0 0 2 0 4', '10', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (10, '4
3 2 1 0', '0', FALSE);
INSERT INTO `test_cases` (`problem_id`, `input`, `expected_output`, `is_sample`) VALUES (10, '3
0 1 0', '0', FALSE);

