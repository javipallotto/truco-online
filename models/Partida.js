const mongoose = require('mongoose');

const partidaSchema = new mongoose.Schema({
  jugadores: [String], // ["javi", "otro"]
  ganador: String,
  montoApostado: Number,
  propina: Number,
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Partida', partidaSchema);
