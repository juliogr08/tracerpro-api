const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolConnect, sql } = require('../db');
require('dotenv').config();

exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    await poolConnect;
    const pool = await sql.connect();

    const result = await pool.request()
      .input('correo', sql.VarChar, correo)
      .query('SELECT * FROM Usuarios WHERE correo = @correo');

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const user = result.recordset[0];
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!isMatch) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: user.id_usuario, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id: user.id_usuario,
        nombre: user.nombre,
        rol: user.rol
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
