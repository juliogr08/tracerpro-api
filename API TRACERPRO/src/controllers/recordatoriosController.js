const { poolConnect, sql } = require('../db');

exports.crearRecordatorio = async (req, res) => {
  const { id_lote, actividad, fecha } = req.body;

  try {
    await poolConnect;
    const pool = await sql.connect();

    await pool.request()
      .input('id_lote', sql.Int, id_lote)
      .input('actividad', sql.VarChar, actividad)
      .input('fecha', sql.Date, fecha)
      .input('tipo', sql.VarChar, 'manual')
      .query(`
        INSERT INTO Recordatorios (id_lote, actividad, fecha, tipo)
        VALUES (@id_lote, @actividad, @fecha, @tipo)
      `);

    res.status(201).json({ message: 'Recordatorio creado correctamente' });
  } catch (err) {
    console.error('Error al crear recordatorio:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.obtenerRecordatorios = async (req, res) => {
  try {
    await poolConnect;
    const pool = await sql.connect();
    let query = `
      SELECT R.*, L.nombre as nombre_lote
      FROM Recordatorios R
      JOIN Lotes L ON R.id_lote = L.id_lote
    `;

    if (req.user.rol === 'productor') {
      query += ` WHERE L.id_productor = ${req.user.id}`;
    }

    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener recordatorios:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
