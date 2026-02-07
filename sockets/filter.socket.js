const filterService = require('../services/filter-counter.service');

module.exports = (io, socket) => {
  socket.on('JOIN_FILTERS', () => {
    socket.join('filters');
    const states = filterService.getAllState();
    socket.emit('FILTERS_STATE', { filters: states });
  });

  socket.on('LEAVE_FILTERS', () => socket.leave('filters'));

  socket.on('FILTER_CLICK', ({ filterId }) => {
    const result = filterService.registerClick(filterId);
    if (result.success) {
      io.to('filters').emit('FILTER_UPDATE', {
        filterId: result.filterId,
        usageCount: result.usageCount
      });
    }
  });
};