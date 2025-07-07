// backend/server.js

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const SalaSocket = require('./models/SalaSocket');
const salasSocketRoutes = require('./routes/salasSocket');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/salas', salasSocketRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 Conectado a MongoDB Atlas'))
  .catch(err => console.error('🔴 Error conectando MongoDB Atlas:', err));

const salas = {};
const desconectados = {};

io.on('connection', (socket) => {
  console.log('🟡 Usuario conectado:', socket.id);

  socket.on('guardarJugador', ({ jugador }) => {
    socket.jugador = jugador;
  });

  socket.on('unirseSala', async ({ codigo, jugador, maxJugadores, apuesta }) => {
    if (!salas[codigo]) {
      // Sala nueva (creador)
      salas[codigo] = {
        jugadores: [],
        max: maxJugadores || 2,
        creador: jugador,
        apuesta: apuesta || 1000,
        aceptaronApuesta: {},
        timeout: null,
        confirmTimeout: null
      };

      try {
        await SalaSocket.create({
          codigo,
          jugadores: [jugador],
          maxJugadores: maxJugadores || 2
        });
        console.log(`✅ Sala ${codigo} registrada en MongoDB`);
      } catch (err) {
        console.error(`❌ Error registrando sala ${codigo}`, err.message);
      }

      // ⏳ 10 minutos sin que nadie se una
      salas[codigo].timeout = setTimeout(() => {
        const sala = salas[codigo];
        if (sala && sala.jugadores.length <= 1) {
          const creadorSocket = getSocketByJugador(sala.creador);
          if (creadorSocket) {
            creadorSocket.emit('preguntarCerrarSala', {
              mensaje: 'Nadie se unió en 10 minutos. ¿Querés cerrar la sala?',
              codigo
            });

            // Espera 30s la respuesta del creador
            sala.confirmTimeout = setTimeout(() => {
              console.log(`⏳ Sala ${codigo} cerrada por inactividad`);
              io.to(codigo).emit('salaCerrada');
              delete salas[codigo];
              SalaSocket.deleteOne({ codigo }).catch(err =>
                console.error(`❌ Error al eliminar sala ${codigo}`, err.message)
              );
            }, 30000);
          }
        }
      }, 600000); // 10 min
    } else {
      // Sala existente (jugador se une)
      try {
        const salaDb = await SalaSocket.findOne({ codigo });
        if (salaDb && !salaDb.jugadores.includes(jugador)) {
          salaDb.jugadores.push(jugador);
          await salaDb.save();
        }
      } catch (err) {
        console.error(`❌ Error actualizando sala ${codigo}`, err.message);
      }
    }

    const sala = salas[codigo];

    // Validación
    if (sala.jugadores.length >= sala.max) {
      socket.emit('salaLlena', { mensaje: 'La sala está llena' });
      return;
    }

    // Agrega jugador si no está aún
    if (!sala.jugadores.includes(jugador)) {
      sala.jugadores.push(jugador);
    }

    sala.aceptaronApuesta[jugador] = false;

    // Limpiar timers si hay
    clearTimeout(sala.timeout);
    clearTimeout(sala.confirmTimeout);

    socket.join(codigo);

    io.to(codigo).emit('datosSala', {
      jugadores: sala.jugadores,
      apuesta: sala.apuesta,
      aceptaronApuesta: sala.aceptaronApuesta
    });
  });

  socket.on('aceptarApuesta', ({ codigo }) => {
    const sala = salas[codigo];
    if (sala && socket.jugador) {
      sala.aceptaronApuesta[socket.jugador] = true;

      io.to(codigo).emit('datosSala', {
        jugadores: sala.jugadores,
        apuesta: sala.apuesta,
        aceptaronApuesta: sala.aceptaronApuesta
      });
    }
  });

  socket.on('salirDeSala', ({ codigo, jugador }) => {
    if (salas[codigo]) {
      salas[codigo].jugadores = salas[codigo].jugadores.filter(j => j !== jugador);
      delete salas[codigo].aceptaronApuesta[jugador];
      io.to(codigo).emit('jugadoresActualizados', salas[codigo].jugadores);
    }
    socket.leave(codigo);
  });

  socket.on('mantenerSala', ({ codigo }) => {
    if (salas[codigo]) {
      clearTimeout(salas[codigo].confirmTimeout);
      salas[codigo].confirmTimeout = null;
      console.log(`✅ Sala ${codigo} se mantiene activa por decisión del creador.`);
    }
  });

  socket.on('cerrarSalaPorInactividad', async ({ codigo }) => {
    if (salas[codigo]) {
      delete salas[codigo];
      io.to(codigo).emit('salaCerrada');
      try {
        await SalaSocket.deleteOne({ codigo });
        console.log(`⛔ Sala ${codigo} cerrada por inactividad`);
      } catch (err) {
        console.error(`❌ Error al eliminar sala ${codigo}`, err.message);
      }
    }
  });

  socket.on('disconnecting', async () => {
    const salasUsuario = Array.from(socket.rooms);
    for (const codigo of salasUsuario) {
      if (salas[codigo]) {
        const jugador = socket.jugador;
        if (!jugador) continue;

        desconectados[jugador] = setTimeout(async () => {
          salas[codigo].jugadores = salas[codigo].jugadores.filter(j => j !== jugador);
          delete salas[codigo].aceptaronApuesta[jugador];
          io.to(codigo).emit('jugadoresActualizados', salas[codigo].jugadores);

          try {
            const salaDb = await SalaSocket.findOne({ codigo });
            if (salaDb) {
              salaDb.jugadores = salaDb.jugadores.filter(j => j !== jugador);
              await salaDb.save();
            }
          } catch (err) {
            console.error(`❌ Error quitando jugador de sala ${codigo}`, err.message);
          }

          delete desconectados[jugador];
        }, 30000);

        io.to(codigo).emit('jugadorDesconectadoTemporal', {
          jugador,
          tiempo: 30
        });
      }
    }
  });

  socket.on('reconectarJugador', ({ jugador }) => {
    if (desconectados[jugador]) {
      clearTimeout(desconectados[jugador]);
      delete desconectados[jugador];
      console.log(`🔁 Jugador ${jugador} reconectó a tiempo.`);
    }
  });

  // Futuro: cambiar apuesta para revancha
  socket.on('cambiarApuesta', ({ codigo, nuevaApuesta }) => {
    if (salas[codigo]) {
      salas[codigo].apuesta = nuevaApuesta;
      salas[codigo].aceptaronApuesta = {};
      for (const jugador of salas[codigo].jugadores) {
        salas[codigo].aceptaronApuesta[jugador] = false;
      }

      io.to(codigo).emit('datosSala', {
        jugadores: salas[codigo].jugadores,
        apuesta: nuevaApuesta,
        aceptaronApuesta: salas[codigo].aceptaronApuesta
      });
    }
  });
});

function getSocketByJugador(jugador) {
  for (let [id, socket] of io.of('/').sockets) {
    if (socket.jugador === jugador) {
      return socket;
    }
  }
  return null;
}

server.listen(5000, () => {
  console.log('🚀 Servidor backend y Socket.IO corriendo en http://localhost:5000');
});
