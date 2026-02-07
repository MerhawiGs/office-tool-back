const router = require('express').Router();
const authController = require('../../controllers/auth.controller');
const { registerValidation, loginValidation } = require('../../middleware/validation');
const { authLimiter, registerLimiter } = require('../../middleware/rateLimiter');
const { protect } = require('../../middleware/authMiddleware');

// Public routes (with rate limiting)
router.post('/register', registerLimiter, registerValidation, authController.register);
router.post('/login', authLimiter, loginValidation, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.get('/users', authController.getUsers); // For testing purposes, consider removing or protecting this in production

// Protected routes (require authentication)
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getCurrentUser);

module.exports = router;
