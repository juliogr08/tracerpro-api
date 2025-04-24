const express = require('express');
const router = express.Router();
const { crearRecordatorio, obtenerRecordatorios } = require('../controllers/recordatoriosController');
const { authMiddleware } = require('../middlewares/auth');

router.post('/', authMiddleware, crearRecordatorio);
router.get('/', authMiddleware, obtenerRecordatorios);

module.exports = router;
