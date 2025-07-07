// backend/models/SalaSocket.js

const mongoose = require('mongoose');

const SalaSocketSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  jugadores: [String],
  maxJugadores: { type: Number, required: true },
  activa: { type: Boolean, default: true },
  creadaEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SalaSocket', SalaSocketSchema);
