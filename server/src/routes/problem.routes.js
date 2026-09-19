const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problem.controller');
const { validateProblem, validateTestCase } = require('../validators/problem.validator');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

// Public / User Routes
router.get('/', optionalAuthenticate, problemController.getProblems);
router.get('/:slug', optionalAuthenticate, problemController.getProblem);

// Admin Problem Management Routes
router.post('/', authenticate, requireAdmin, validateProblem, problemController.createProblem);
router.put('/:id', authenticate, requireAdmin, validateProblem, problemController.updateProblem);
router.delete('/:id', authenticate, requireAdmin, problemController.deleteProblem);

// Admin Test Case Management Routes
router.get('/:id/test-cases', authenticate, requireAdmin, problemController.getAdminTestCases);
router.post('/:id/test-cases', authenticate, requireAdmin, validateTestCase, problemController.addTestCase);
router.put('/test-cases/:testCaseId', authenticate, requireAdmin, validateTestCase, problemController.updateTestCase);
router.delete('/test-cases/:testCaseId', authenticate, requireAdmin, problemController.deleteTestCase);

module.exports = router;
