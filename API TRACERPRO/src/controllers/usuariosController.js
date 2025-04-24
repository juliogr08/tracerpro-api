const bcrypt = require('bcryptjs');
const { poolConnect, sql } = require('../db');

exports.createUsuario = async (req, res) => {
  const { nombre, correo, contrasena, rol } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    await poolConnect;
    const pool = await sql.connect();

    await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('correo', sql.VarChar, correo)
      .input('contrasena', sql.VarChar, hashedPassword)
      .input('rol', sql.VarChar, rol)
      .query(`
        INSERT INTO Usuarios (nombre, correo, contrasena, rol)
        VALUES (@nombre, @correo, @contrasena, @rol)
      `);

    res.status(201).json({ message: 'Usuario creado correctamente' });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
