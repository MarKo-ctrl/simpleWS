const { WebSocket } = require('ws');

exports.createWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (webSocket) => {
    webSocket.on('message', (message) => {
      const data = JSON.parse(message);

      if (data.type === 'ECHO') {
        webSocket.send(JSON.stringify(data.value))
      } else {
        for (let i = 1; i <= Number.parseInt(data.type.slice(-1)); i++) {
          webSocket.send(JSON.stringify(data.value))
        }
      }
    })
  })
}