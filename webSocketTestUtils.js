const http = require('http');
const { createWebSocketServer } = require('./createWSserver');

exports.serverStart = (port) => {
  const server = http.createServer();
  createWebSocketServer(server);

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  })
}