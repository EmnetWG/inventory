const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
//const sanitizeInput = require('../middlewares/sanitizeInput');

// router.post('/login', sanitizeInput, authController.login);
// router.post('/register', sanitizeInput, authController.register);
router.post('/login',  authController.login);
router.post('/register',  authController.register);
router.post('/logout', authController.logout);

module.exports = router;
