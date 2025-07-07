const express = require('express');
const router = express.Router();
const Sala = require('../models/Sala');
const authMiddleware = require('../middleware/authMiddleware');
const { nanoid } = require('nanoid');

// Crear sala (abierta o privada)
router.post('/crear', authMiddleware, async (req, res) => {
  try {
    const { tipo } = req.body;
    const username = req.username;

    const nuevaSala = new Sala({
      tipo: tipo === 'privada' ? 'privada' : 'abierta',
      codigo: tipo === 'privada' ? nanoid(6).toUpperCase() : null,
      jugadores: [username],
      creadaPor: username,
    });

    await nuevaSala.save();
    res.json({ sala: nuevaSala });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear sala' });
  }
});

// Unirse a sala abierta
router.post('/unirse-publica', authMiddleware, async (req, res) => {
  try {
    const username = req.username;

    let sala = await Sala.findOne({ tipo: 'abierta', activa: true });

    if (!sala) {
      sala = new Sala({
        tipo: 'abierta',
        jugadores: [username],
        creadaPor: username,
      });
      await sala.save();
    } else if (!sala.jugadores.includes(username)) {
      if (sala.jugadores.length >= sala.maxJugadores) {
        return res.status(400).json({ error: 'La sala está llena' });
      }

      sala.jugadores.push(username);
      await sala.save();
    }

    res.json({ sala });
  } catch (err) {
    res.status(500).json({ error: 'Error al unirse a sala abierta' });
  }
});

// Unirse a sala privada
router.post('/unirse-privada', authMiddleware, async (req, res) => {
  try {
    const { codigo } = req.body;
    const username = req.username;

    const sala = await Sala.findOne({ codigo, tipo: 'privada', activa: true });

    if (!sala) return res.status(404).json({ error: 'Sala no encontrada' });

    if (sala.jugadores.includes(username))
      return res.json({ sala });

    if (sala.jugadores.length >= sala.maxJugadores)
      return res.status(400).json({ error: 'La sala está llena' });

    sala.jugadores.push(username);
    await sala.save();

    res.json({ sala });
  } catch (err) {
    res.status(500).json({ error: 'Error al unirse a sala privada' });
  }
});

// Listar salas activas
router.get('/activas', authMiddleware, async (req, res) => {
  try {
    const salas = await Sala.find({ activa: true }).sort({ createdAt: -1 });
    res.json({ salas });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener salas activas' });
  }
});

module.exports = router;
