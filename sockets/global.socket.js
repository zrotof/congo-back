module.exports = (io, socket) => {
  socket.on('JOIN_GLOBAL', () => {
    socket.join('global');
  });

  socket.on('LEAVE_GLOBAL', () => {
    socket.leave('global');
  });
};