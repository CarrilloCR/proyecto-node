
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../seguridad/auth');

// Rutas públicas
router.post('/registro', authController.registrar);
router.post('/login', authController.login);

// Rutas protegidas
router.get('/perfil', verificarToken, authController.perfil);
router.put('/perfil', verificarToken, authController.actualizarPerfil);

module.exports = router;