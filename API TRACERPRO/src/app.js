const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/auth', require('./routes/auth'));
app.use('/usuarios', require('./routes/usuarios'));
app.use('/productores', require('./routes/productores'));
app.use('/lotes', require('./routes/lotes'));
app.use('/eventos', require('./routes/eventos'));
app.use('/recordatorios', require('./routes/recordatorios'));
app.use('/insumos', require('./routes/insumos'));
app.use('/trazabilidad', require('./routes/trazabilidad'));

// Server start
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
