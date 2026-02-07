const { Server } = require('socket.io');
const { whiteList } = require('../cors');
const registerChallengeEvents = require('./challenge.socket');
const registerFilterEvents = require('./filter.socket');
const registerGlobalEvents = require('./global.socket'); // ✅ Import

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: whiteList,
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['polling']
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client: ${socket.id}`);
    
    registerChallengeEvents(io, socket);
    registerFilterEvents(io, socket);
    registerGlobalEvents(io, socket); // ✅ Register
    
    socket.on('disconnect', () => console.log(`❌ Disconnect: ${socket.id}`));
  });

  return io;
};