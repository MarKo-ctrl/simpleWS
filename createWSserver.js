const { WebSocket } = require('ws');

const groupNames = [];

exports.createWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (webSocket) => {
    webSocket.on('message', (message) => {
      const data = JSON.parse(message);

      if (data.type === 'ECHO') {
        webSocket.send(JSON.stringify(data.value))
      }
      else if (data.type === 'ECHO_TIMES_3') {
        for (let i = 1; i <= Number.parseInt(data.type.slice(-1)); i++) {
          webSocket.send(JSON.stringify(data.value))
        }
      }
      else if (data.type === 'ECHO_TO_ALL') {
        wss.clients.forEach((ws) => ws.send(JSON.stringify(data.value)));
      }
      else if (data.type === 'CREATE_GROUP') {
        const groupName = data.value;

        if (!groupNames.find((gn) => gn === groupName)) {
          groupNames.push(groupName);
          webSocket.groupName = groupName;
          webSocket.send(JSON.stringify(groupName));
        }
        else {
          webSocket.send(JSON.stringify('GROUP_UNAVAILABLE'));
        }
      }
      else if (data.type === 'JOIN_GROUP') {
        const groupName = data.value;

        if (!groupNames.find((gn) => gn === groupName)) {
          webSocket.send(JSON.stringify('GROUP_UNAVAILABLE'));
        }
        else {
          webSocket.groupName = groupName;
          webSocket.send(JSON.stringify(groupName));
        }
      }
      else if (data.type === 'MESSAGE_GROUP') {
        const { groupName, groupMessage } = data.value;
        if (webSocket.groupName !== groupName);
        wss.clients.forEach((ws) => {
          if (ws.groupName === groupName) ws.send(JSON.stringify(groupMessage));
        });
      }
    })
  })
}