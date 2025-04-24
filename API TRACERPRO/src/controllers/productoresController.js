const { poolConnect, sql } = require('../db');

exports.getProductores = async (req, res) => {
  try {
    await poolConnect;
    const pool = await sql.connect();

    const result = await pool.request()
      .query("SELECT id_usuario, nombre, correo FROM Usuarios WHERE rol = 'productor'");

    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener productores:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getLotesPorProductor = async (req, res) => {
  const id = req.params.id;

  // Validar que el productor solo vea sus propios lotes
  if (req.user.rol !== 'admin' && req.user.id !== parseInt(id)) {
    return res.status(403).json({ message: 'Acceso denegado' });
  }

  try {
    await poolConnect;
    const pool = await sql.connect();

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query("SELECT * FROM Lotes WHERE id_productor = @id");

    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener lotes del productor:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
