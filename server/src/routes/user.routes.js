const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/profile', authenticate, userController.getProfile);
router.get('/dashboard', authenticate, userController.getDashboard);

module.exports = router;
