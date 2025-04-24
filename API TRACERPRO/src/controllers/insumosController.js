const { poolConnect, sql } = require('../db');

exports.agregarInsumo = async (req, res) => {
  const { nombre, descripcion, tipo } = req.body;

  try {
    await poolConnect;
    const pool = await sql.connect();

    await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('descripcion', sql.VarChar, descripcion)
      .input('tipo', sql.VarChar, tipo)
      .query(`
        INSERT INTO Insumos (nombre, descripcion, tipo)
        VALUES (@nombre, @descripcion, @tipo)
      `);

    res.status(201).json({ message: 'Insumo registrado correctamente' });
  } catch (err) {
    console.error('Error al registrar insumo:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.aplicarInsumo = async (req, res) => {
  const { id_lote, id_insumo, cantidad, fecha_aplicacion, observaciones } = req.body;

  try {
    await poolConnect;
    const pool = await sql.connect();

    await pool.request()
      .input('id_lote', sql.Int, id_lote)
      .input('id_insumo', sql.Int, id_insumo)
      .input('cantidad', sql.Float, cantidad)
      .input('fecha_aplicacion', sql.Date, fecha_aplicacion)
      .input('observaciones', sql.VarChar, observaciones)
      .query(`
        INSERT INTO Insumos_Aplicados (id_lote, id_insumo, cantidad, fecha_aplicacion, observaciones)
        VALUES (@id_lote, @id_insumo, @cantidad, @fecha_aplicacion, @observaciones)
      `);

    res.status(201).json({ message: 'Insumo aplicado correctamente' });
  } catch (err) {
    console.error('Error al aplicar insumo:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
