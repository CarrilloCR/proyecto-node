const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Importar rutas correctas
const authRoutes = require('./routes/usuario');
const vehiculoRoutes = require('./routes/vehiculo');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB Atlas
const mongoURI = 'mongodb+srv://fabiancarrillo2k:tfi4LadqksCKt495@carris.jtildip.mongodb.net/registro_vehiculos?retryWrites=true&w=majority&appName=carris';

mongoose.connect(mongoURI);

mongoose.connection.on('connected', () => {
  console.log('✅ Conectado a MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión a MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Desconectado de MongoDB');
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/vehiculos', vehiculoRoutes);

// Ruta principal - servir login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API de Registro de Vehículos funcionando correctamente',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString()
  });
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor API escuchando en http://localhost:${PORT}`);
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await mongoose.connection.close();
  console.log('✅ Conexión a MongoDB cerrada');
  process.exit(0);
});

module.exports = app;