const express = require('express');
const router = express.Router();
const SalaSocket = require('../models/SalaSocket');

// GET /api/salas-socket/activas
router.get('/activas', async (req, res) => {
  try {
    const salas = await SalaSocket.find({ activa: true }).sort({ creadaEn: -1 });
    res.json({ salas });
  } catch (err) {
    console.error('Error al obtener salas Socket.IO:', err);
    res.status(500).json({ error: 'Error al obtener salas activas' });
  }
});

module.exports = router;
