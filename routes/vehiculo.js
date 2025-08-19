// routes/vehiculos.js
const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');
const { verificarToken } = require('../middleware/auth');

// Todas las rutas de vehículos requieren autenticación
router.use(verificarToken);

// CRUD de vehículos
router.post('/', vehiculoController.crear);
router.get('/', vehiculoController.obtenerTodos);
router.get('/estadisticas', vehiculoController.estadisticas);
router.get('/:id', vehiculoController.obtenerPorId);
router.put('/:id', vehiculoController.actualizar);
router.delete('/:id', vehiculoController.eliminar);

module.exports = router;