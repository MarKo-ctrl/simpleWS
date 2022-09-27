const ws = require('ws');

exports.createWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (webSocket) => {
    webSocket.on('message', (message) => {
      webSocket.send('message')
    });
  });
};