const express = require('express');
const router = express.Router();
const { subirEvidencia, getTrazabilidad } = require('../controllers/trazabilidadController');
const { authMiddleware } = require('../middlewares/auth');

router.post('/evidencias', authMiddleware, subirEvidencia);
router.get('/:id', authMiddleware, getTrazabilidad);

module.exports = router;
