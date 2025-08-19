const Vehiculo = require('../models/Vehiculo');
const Usuario = require('../models/Usuario');

const vehiculoController = {
  // CREATE - Crear un nuevo vehículo
  async crear(req, res) {
    try {
      const {
        marca,
        modelo,
        año,
        placa,
        color,
        tipoVehiculo,
        numeroChasis,
        numeroMotor,
        combustible,
        kilometraje
      } = req.body;

      // Verificar que el usuario existe
      const usuario = await Usuario.findById(req.usuarioId);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Crear nuevo vehículo
      const nuevoVehiculo = new Vehiculo({
        propietario: req.usuarioId,
        marca,
        modelo,
        año,
        placa,
        color,
        tipoVehiculo,
        numeroChasis,
        numeroMotor,
        combustible,
        kilometraje
      });

      await nuevoVehiculo.save();

      // Popular la información del propietario
      await nuevoVehiculo.populate('propietario', 'nombre email');

      res.status(201).json({
        message: 'Vehículo registrado exitosamente',
        vehiculo: nuevoVehiculo
      });

    } catch (error) {
      if (error.code === 11000) {
        const campo = Object.keys(error.keyValue)[0];
        return res.status(400).json({ 
          error: `Ya existe un vehículo con el mismo ${campo}` 
        });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // READ - Obtener todos los vehículos del usuario autenticado
  async obtenerTodos(req, res) {
    try {
      const { page = 1, limit = 10, estado, tipoVehiculo } = req.query;
      
      // Construir filtros
      const filtros = { propietario: req.usuarioId };
      if (estado) filtros.estado = estado;
      if (tipoVehiculo) filtros.tipoVehiculo = tipoVehiculo;

      const vehiculos = await Vehiculo.find(filtros)
        .populate('propietario', 'nombre email')
        .sort({ fechaRegistro: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Vehiculo.countDocuments(filtros);

      res.json({
        vehiculos,
        totalPaginas: Math.ceil(total / limit),
        paginaActual: page,
        total
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // READ - Obtener un vehículo específico
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;

      const vehiculo = await Vehiculo.findOne({
        _id: id,
        propietario: req.usuarioId
      }).populate('propietario', 'nombre email telefono');

      if (!vehiculo) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }

      res.json({ vehiculo });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // UPDATE - Actualizar un vehículo
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const {
        marca,
        modelo,
        año,
        placa,
        color,
        tipoVehiculo,
        numeroChasis,
        numeroMotor,
        combustible,
        kilometraje,
        estado
      } = req.body;

      const vehiculo = await Vehiculo.findOneAndUpdate(
        { _id: id, propietario: req.usuarioId },
        {
          marca,
          modelo,
          año,
          placa,
          color,
          tipoVehiculo,
          numeroChasis,
          numeroMotor,
          combustible,
          kilometraje,
          estado
        },
        { new: true, runValidators: true }
      ).populate('propietario', 'nombre email');

      if (!vehiculo) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }

      res.json({
        message: 'Vehículo actualizado exitosamente',
        vehiculo
      });

    } catch (error) {
      if (error.code === 11000) {
        const campo = Object.keys(error.keyValue)[0];
        return res.status(400).json({ 
          error: `Ya existe un vehículo con el mismo ${campo}` 
        });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE - Eliminar un vehículo
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      const vehiculo = await Vehiculo.findOneAndDelete({
        _id: id,
        propietario: req.usuarioId
      });

      if (!vehiculo) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }

      res.json({
        message: 'Vehículo eliminado exitosamente',
        vehiculo
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // EXTRA - Obtener estadísticas de vehículos del usuario
  async estadisticas(req, res) {
    try {
      const stats = await Vehiculo.aggregate([
        { $match: { propietario: req.usuarioId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            porTipo: { $push: '$tipoVehiculo' },
            porEstado: { $push: '$estado' },
            añoPromedio: { $avg: '$año' },
            kilometrajePromedio: { $avg: '$kilometraje' }
          }
        }
      ]);

      if (stats.length === 0) {
        return res.json({
          total: 0,
          porTipo: {},
          porEstado: {},
          añoPromedio: 0,
          kilometrajePromedio: 0
        });
      }

      const estadisticas = stats[0];
      
      // Contar por tipo y estado
      const tipoCount = {};
      const estadoCount = {};
      
      estadisticas.porTipo.forEach(tipo => {
        tipoCount[tipo] = (tipoCount[tipo] || 0) + 1;
      });
      
      estadisticas.porEstado.forEach(estado => {
        estadoCount[estado] = (estadoCount[estado] || 0) + 1;
      });

      res.json({
        total: estadisticas.total,
        porTipo: tipoCount,
        porEstado: estadoCount,
        añoPromedio: Math.round(estadisticas.añoPromedio),
        kilometrajePromedio: Math.round(estadisticas.kilometrajePromedio)
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = vehiculoController;