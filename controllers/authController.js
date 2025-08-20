const Usuario = require('../models/usuarios');
const jwt = require('jsonwebtoken');

const authController = {
  // Registro de usuario
  async registrar(req, res) {
    try {
      const { nombre, email, clave, telefono, direccion } = req.body;

      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      // Crear nuevo usuario
      const nuevoUsuario = new Usuario({
        nombre,
        email,
        clave,
        telefono,
        direccion
      });

      await nuevoUsuario.save();

      // Generar token
      const token = jwt.sign(
        { id: nuevoUsuario._id, email: nuevoUsuario.email },
        'SECRETO_SUPER_SEGUR0',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token,
        usuario: {
          id: nuevoUsuario._id,
          nombre: nuevoUsuario.nombre,
          email: nuevoUsuario.email,
          telefono: nuevoUsuario.telefono,
          direccion: nuevoUsuario.direccion
        }
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Login de usuario
  async login(req, res) {
    try {
      const { email, clave } = req.body;

      // Buscar usuario
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const claveValida = await usuario.compararClave(clave);
      if (!claveValida) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Generar token
      const token = jwt.sign(
        { id: usuario._id, email: usuario.email },
        'SECRETO_SUPER_SEGUR0',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login exitoso',
        token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          telefono: usuario.telefono,
          direccion: usuario.direccion
        }
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener perfil del usuario autenticado
  async perfil(req, res) {
    try {
      const usuario = await Usuario.findById(req.usuarioId).select('-clave');
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({ usuario });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar perfil
  async actualizarPerfil(req, res) {
    try {
      const { nombre, telefono, direccion } = req.body;
      
      const usuario = await Usuario.findByIdAndUpdate(
        req.usuarioId,
        { nombre, telefono, direccion },
        { new: true, runValidators: true }
      ).select('-clave');

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({
        message: 'Perfil actualizado exitosamente',
        usuario
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = authController;