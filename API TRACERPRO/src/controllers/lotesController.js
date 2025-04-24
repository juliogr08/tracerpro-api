const { poolConnect, sql } = require('../db');

exports.createLote = async (req, res) => {
  const { nombre, id_cultivo, fecha_siembra, ubicacion } = req.body;
  const id_productor = req.user.id;

  try {
    await poolConnect;
    const pool = await sql.connect();

    // Crear lote
    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('id_cultivo', sql.Int, id_cultivo)
      .input('id_productor', sql.Int, id_productor)
      .input('fecha_siembra', sql.Date, fecha_siembra)
      .input('ubicacion', sql.VarChar, ubicacion)
      .query(`
        INSERT INTO Lotes (nombre, id_cultivo, id_productor, fecha_siembra, ubicacion)
        OUTPUT INSERTED.id_lote
        VALUES (@nombre, @id_cultivo, @id_productor, @fecha_siembra, @ubicacion)
      `);

    const id_lote = result.recordset[0].id_lote;

    // Obtener actividades y frecuencias
    const actividades = await pool.request()
      .input('id_cultivo', sql.Int, id_cultivo)
      .query(`
        SELECT actividad, dias_despues
        FROM Frecuencias_Cultivo
        WHERE id_cultivo = @id_cultivo
      `);

    // Insertar recordatorios automáticos
    const fechaBase = new Date(fecha_siembra);

    for (const row of actividades.recordset) {
      const fechaRecordatorio = new Date(fechaBase);
      fechaRecordatorio.setDate(fechaBase.getDate() + row.dias_despues);

      await pool.request()
        .input('id_lote', sql.Int, id_lote)
        .input('actividad', sql.VarChar, row.actividad)
        .input('fecha', sql.Date, fechaRecordatorio)
        .input('tipo', sql.VarChar, 'automatico')
        .query(`
          INSERT INTO Recordatorios (id_lote, actividad, fecha, tipo)
          VALUES (@id_lote, @actividad, @fecha, @tipo)
        `);
    }

    res.status(201).json({ message: 'Lote creado con recordatorios generados automáticamente.' });

  } catch (err) {
    console.error('Error al crear lote:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
