module.exports = (io) => {
  // Make io available in routes
  const app = require('express')();
  app.set('io', io);

  io.on('connection', (socket) => {
    // Join by company room or user room
    socket.on('join', ({ companyId, userId }) => {
      if (companyId) socket.join(companyId);
      if (userId) socket.join(userId);
    });

    socket.on('disconnect', () => {});
  });
};
