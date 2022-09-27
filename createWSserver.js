const ws = require('ws');

exports.createWebSocketServer = (server) => {
  const wss = new ws.Server({ server });

  wss.on('connection', (webSocket) => {
    webSocket.on('message', (message) => {
      webSocket.send('message')
    });
  });
};