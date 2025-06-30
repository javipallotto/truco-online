const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  saldo: { type: Number, default: 0 },
  partidasJugadas: { type: Number, default: 0 },
  partidasGanadas: { type: Number, default: 0 }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
