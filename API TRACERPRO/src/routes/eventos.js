const express = require('express');
const router = express.Router();
const { getEventosPorLote, addEvento } = require('../controllers/eventosController');
const { authMiddleware } = require('../middlewares/auth');

router.get('/lotes/:id/eventos', authMiddleware, getEventosPorLote);
router.post('/', authMiddleware, addEvento);

module.exports = router;
