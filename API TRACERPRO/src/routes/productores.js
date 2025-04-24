const express = require('express');
const router = express.Router();
const { getProductores, getLotesPorProductor } = require('../controllers/productoresController');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');

router.get('/', authMiddleware, authorizeRoles('admin'), getProductores);
router.get('/:id/lotes', authMiddleware, getLotesPorProductor);

module.exports = router;
