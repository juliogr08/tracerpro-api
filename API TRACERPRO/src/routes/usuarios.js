const express = require('express');
const router = express.Router();
const { createUsuario } = require('../controllers/usuariosController');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');

router.post('/', authMiddleware, authorizeRoles('admin'), createUsuario);

module.exports = router;
