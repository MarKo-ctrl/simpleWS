const http = require('http');
const { createWebSocketServer } = require('./createWSserver');

exports.serverStart = (port) => {
  const server = http.createServer();
  createWebSocketServer(server);

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  })
}

exports.waitSocketState = (socket, state) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (socket.readyState === state) {
        resolve();
      } else {
        this.waitSocketState(socket, state)
          .then(resolve);
      }
    }, 5)
  })
}