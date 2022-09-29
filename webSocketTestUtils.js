const http = require('http');
const WebSocket = require('ws');
const { createWebSocketServer } = require('./createWSserver');

exports.serverStart = (port) => {
  const server = http.createServer();
  createWebSocketServer(server);

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
};

exports.waitSocketState = (socket, state) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (socket.readyState === state) {
        resolve();
      } else {
        this.waitSocketState(socket, state)
          .then(resolve);
      }
    }, 5);
  });
};

exports.createSocketClient = async (port, closeAfter) => {
  const client = new WebSocket(`ws://localhost:${port}`);
  const messages = [];
  await this.waitSocketState(client, client.OPEN);
  
  client.on('message', (data) => {
    messages.push(JSON.parse(data));
    messages.length === closeAfter ? client.close() : null;
  });

  return [client, messages];
};