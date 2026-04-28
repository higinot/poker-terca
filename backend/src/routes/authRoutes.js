const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Definindo os endpoints e mapeando para o controller
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
