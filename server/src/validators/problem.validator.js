const { sendError } = require('../utils/responseHelper');

const VALID_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const validateProblem = (req, res, next) => {
  const { title, description, difficulty, category, test_cases } = req.body;
  const errors = {};

  if (!title || typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 255) {
    errors.title = 'Title must be between 3 and 255 characters.';
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.description = 'Description is required.';
  }

  if (!difficulty || !VALID_DIFFICULTIES.includes(difficulty)) {
    errors.difficulty = `Difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`;
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.category = 'Category is required.';
  }

  if (req.method === 'POST') {
    if (!Array.isArray(test_cases) || test_cases.length === 0) {
      errors.test_cases = 'At least one test case is required.';
    } else {
      let hasSample = false;
      let hasHidden = false;
      for (let i = 0; i < test_cases.length; i++) {
        const tc = test_cases[i];
        if (typeof tc.input !== 'string' || typeof tc.expected_output !== 'string') {
          errors.test_cases = `Test case at index ${i} must have string input and expected_output.`;
          break;
        }
        if (tc.is_sample) hasSample = true;
        else hasHidden = true;
      }
      if (!errors.test_cases && (!hasSample || !hasHidden)) {
        errors.test_cases = 'Problem must include at least one sample test case and at least one hidden test case.';
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return sendError(res, 'Problem validation failed', 400, errors);
  }

  next();
};

const validateTestCase = (req, res, next) => {
  const { input, expected_output } = req.body;
  const errors = {};

  if (typeof input !== 'string') {
    errors.input = 'Input must be a string.';
  }

  if (typeof expected_output !== 'string') {
    errors.expected_output = 'Expected output must be a string.';
  }

  if (Object.keys(errors).length > 0) {
    return sendError(res, 'Test case validation failed', 400, errors);
  }

  next();
};

module.exports = {
  validateProblem,
  validateTestCase
};
