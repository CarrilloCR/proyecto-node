const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Cargar variables de entorno desde .env

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


// Conexión a MongoDB usando el URI desde .env
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error al conectar a MongoDB:", err));

app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Servidor API escuchando en http://localhost:${process.env.PORT}`);
});


// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await mongoose.connection.close();
  console.log('✅ Conexión a MongoDB cerrada');
  process.exit(0);
});

module.exports = app;