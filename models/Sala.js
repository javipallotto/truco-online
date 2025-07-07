const mongoose = require('mongoose');

const SalaSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  tipo: { type: String, enum: ['privada', 'abierta'], default: 'privada' },
  maxJugadores: { type: Number, default: 2 },
  jugadores: [{ type: String }], // ← ahora solo strings, no ObjectId
  creadaPor: { type: String },   // ← también nombre de usuario
  activa: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Sala', SalaSchema);
