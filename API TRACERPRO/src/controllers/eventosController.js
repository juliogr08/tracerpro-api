const { poolConnect, sql } = require('../db');

exports.getEventosPorLote = async (req, res) => {
  const id_lote = parseInt(req.params.id);

  try {
    await poolConnect;
    const pool = await sql.connect();

    const result = await pool.request()
      .input('id_lote', sql.Int, id_lote)
      .query('SELECT * FROM Eventos WHERE id_lote = @id_lote ORDER BY fecha DESC');

    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener eventos:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.addEvento = async (req, res) => {
  const { id_lote, tipo_evento, descripcion, fecha } = req.body;

  try {
    await poolConnect;
    const pool = await sql.connect();

    await pool.request()
      .input('id_lote', sql.Int, id_lote)
      .input('tipo_evento', sql.VarChar, tipo_evento)
      .input('descripcion', sql.VarChar, descripcion)
      .input('fecha', sql.Date, fecha)
      .query(`
        INSERT INTO Eventos (id_lote, tipo_evento, descripcion, fecha)
        VALUES (@id_lote, @tipo_evento, @descripcion, @fecha)
      `);

    res.status(201).json({ message: 'Evento registrado correctamente' });
  } catch (err) {
    console.error('Error al registrar evento:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
