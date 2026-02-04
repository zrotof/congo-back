const viewService = require('../services/view.service');

module.exports = (io, socket) => {

  /**
   * JOIN_FILTERS
   * Client rejoint la section filtres
   */
  socket.on('JOIN_FILTERS', () => {
    socket.join('filters');

    const states = viewService.getAllFiltersState();
    socket.emit('FILTERS_STATE', { filters: states });
  });

  /**
   * LEAVE_FILTERS
   * Client quitte la section filtres
   */
  socket.on('LEAVE_FILTERS', () => {
    socket.leave('filters');
  });

  /**
   * FILTER_CLICK
   * Clic sur "Utiliser ce filtre"
   */
  socket.on('FILTER_CLICK', ({ filterId }) => {
    const result = viewService.registerFilterClick(filterId);

    if (result.success) {
      io.to('filters').emit('FILTER_UPDATE', {
        filterId: result.filterId,
        usageCount: result.usageCount
      });
    }
  });
};