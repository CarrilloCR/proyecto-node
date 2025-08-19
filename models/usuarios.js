const { Schema, model } = require('mongoose');

const usuarioSchema = new Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  clave: { 
    type: String, 
    required: true,
    minlength: 6
  },
  telefono: {
    type: String,
    trim: true
  },
  direccion: {
    type: String,
    trim: true
  },
  fechaRegistro: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware para hashear la contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('clave')) return next();
  
  const bcrypt = require('bcrypt');
  this.clave = await bcrypt.hash(this.clave, 10);
  next();
});

// Método para comparar contraseñas
usuarioSchema.methods.compararClave = async function(claveIngresada) {
  const bcrypt = require('bcrypt');
  return await bcrypt.compare(claveIngresada, this.clave);
};

module.exports = model('Usuario', usuarioSchema);