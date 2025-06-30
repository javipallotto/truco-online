const mongoose = require('mongoose');

const salaSchema = new mongoose.Schema({
  nombre: String,
  tipo: { type: String, enum: ['abierta', 'privada'], default: 'abierta' },
  codigo: String,
  jugadores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
  maxJugadores: { type: Number, default: 2 },
  creadaPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  activa: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Sala', salaSchema);
