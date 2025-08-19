const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./models/usuarios');
const vehiculoRoutes = require('./models/vehiculos');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/registro_vehiculos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/vehiculos', vehiculoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Registro de Vehículos funcionando correctamente' });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;