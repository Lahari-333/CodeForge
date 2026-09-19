const express = require('express');
const router = express.Router();
const executionController = require('../controllers/execution.controller');
const { validateExecution } = require('../validators/execution.validator');
const { optionalAuthenticate } = require('../middleware/auth.middleware');

router.post('/execute', optionalAuthenticate, validateExecution, executionController.executeCode);

module.exports = router;
