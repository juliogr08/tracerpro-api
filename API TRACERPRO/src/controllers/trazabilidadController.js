const { poolConnect, sql } = require('../db');

exports.subirEvidencia = async (req, res) => {
  const { id_lote, url, descripcion } = req.body;

  try {
    await poolConnect;
    const pool = await sql.connect();

    await pool.request()
      .input('id_lote', sql.Int, id_lote)
      .input('url', sql.VarChar, url)
      .input('descripcion', sql.VarChar, descripcion)
      .query(`
        INSERT INTO Evidencias (id_lote, url, descripcion, fecha)
        VALUES (@id_lote, @url, @descripcion, GETDATE())
      `);

    res.status(201).json({ message: 'Evidencia subida correctamente' });
  } catch (err) {
    console.error('Error al subir evidencia:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getTrazabilidad = async (req, res) => {
  const id_lote = req.params.id;

  try {
    await poolConnect;
    const pool = await sql.connect();

    const result = await pool.request()
      .input('id_lote', sql.Int, id_lote)
      .query(`
        SELECT L.*, C.nombre AS cultivo, Q.codigo_qr, Q.codigo_rfid
        FROM Lotes L
        JOIN Cultivos C ON L.id_cultivo = C.id_cultivo
        LEFT JOIN Trazabilidad Q ON Q.id_lote = L.id_lote
        WHERE L.id_lote = @id_lote
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Lote no encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error al obtener trazabilidad:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
