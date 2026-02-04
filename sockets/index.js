const { Server } = require('socket.io');
const { whiteList } = require('../cors');
const registerChallengeEvents = require('./challenge.socket');
const registerFilterEvents = require('./filter.socket');

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: whiteList,
      credentials: true
    }
  });

  let connectedClients = 0;

  io.on('connection', (socket) => {
    connectedClients++;
    console.log(`🔌 Client connecté : ${socket.id} (Total: ${connectedClients})`);

    // Enregistrer les events Challenge
    registerChallengeEvents(io, socket);

    // Enregistrer les events Filtres
    registerFilterEvents(io, socket);

    // Déconnexion
    socket.on('disconnect', () => {
      connectedClients--;
      console.log(`❌ Client déconnecté : ${socket.id} (Total: ${connectedClients})`);
    });
  });

  console.log('🔌 Socket.io initialisé');
  return io;
};