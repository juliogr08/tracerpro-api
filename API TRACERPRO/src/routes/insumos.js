const express = require('express');
const router = express.Router();
const { agregarInsumo, aplicarInsumo } = require('../controllers/insumosController');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');

router.post('/', authMiddleware, authorizeRoles('admin'), agregarInsumo);
router.post('/aplicados', authMiddleware, aplicarInsumo);

module.exports = router;
