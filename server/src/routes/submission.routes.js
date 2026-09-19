const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission.controller');
const { validateExecution } = require('../validators/execution.validator');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');

// Run code against public sample test cases (can be done anonymously or logged in)
router.post('/run-sample', optionalAuthenticate, validateExecution, submissionController.runSampleTests);

// Submit code against all test cases (requires authentication)
router.post('/submit', authenticate, validateExecution, submissionController.submitSolution);

// Get authenticated user's submission history
router.get('/my', authenticate, submissionController.getMySubmissions);

// Get single submission details (protected, user or admin only)
router.get('/:id', authenticate, submissionController.getSubmissionById);

module.exports = router;
