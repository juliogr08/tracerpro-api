const express = require('express');
const router = express.Router();
const { createLote } = require('../controllers/lotesController');
const { authMiddleware } = require('../middlewares/auth');

router.post('/', authMiddleware, createLote);

module.exports = router;
