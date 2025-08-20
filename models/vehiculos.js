const { Schema, model, Types } = require('mongoose');

const vehiculoSchema = new Schema({
  propietario: { 
    type: Types.ObjectId, 
    ref: 'Usuario',
    required: true,
    index: true // Índice para mejorar performance en consultas por propietario
  },
  marca: {
    type: String,
    required: true,
    trim: true,
    index: true // Índice para mejorar performance en consultas por marca
  },
  modelo: {
    type: String,
    required: true,
    trim: true,
    index: true // Índice para mejorar performance en consultas por modelo
  },
  año: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  placa: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true // Índice para mejorar performance en consultas por placa
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  tipoVehiculo: {
    type: String,
    required: true,
    enum: ['automovil', 'motocicleta', 'camion', 'suv', 'van', 'pickup'],
    lowercase: true
  },
  numeroChasis: {
    type: String,
    unique: true,
    sparse: true, // Permite valores null sin violar unique
    trim: true
  },
  numeroMotor: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  combustible: {
    type: String,
    enum: ['gasolina', 'diesel', 'electrico', 'hibrido', 'gas'],
    default: 'gasolina',
    lowercase: true
  },
  kilometraje: {
    type: Number,
    min: 0,
    default: 0
  },
  estado: {
    type: String,
    enum: ['activo', 'vendido', 'siniestrado', 'en_mantenimiento'],
    default: 'activo',
    lowercase: true
  },
  fechaRegistro: { 
    type: Date, 
    default: Date.now 
  },
  fechaUltimaActualizacion: {
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar fechaUltimaActualizacion
vehiculoSchema.pre('findOneAndUpdate', function(next) {
  this.set({ fechaUltimaActualizacion: new Date() });
  next();
});

vehiculoSchema.pre('updateOne', function(next) {
  this.set({ fechaUltimaActualizacion: new Date() });
  next();
});

vehiculoSchema.pre('updateMany', function(next) {
  this.set({ fechaUltimaActualizacion: new Date() });
  next();
});



module.exports = model('Vehiculo', vehiculoSchema);