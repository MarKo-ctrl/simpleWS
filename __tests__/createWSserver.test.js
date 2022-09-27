const WebSocket = require('ws');
const { serverStart, waitSocketState, createSocketClient } = require('../webSocketTestUtils');

const port = 3000;

describe("WebSocket Server", () => {
  let server;

  beforeAll(async () => {
    server = await serverStart(port)
  });

  afterAll(() => server.close());

  it("Server echoes the message it receives from client", async () => {
    // Create test client
    const [client, messages] = await createSocketClient(port, 1);

    // Send client message
    const testMessage = 'This is a test message';
    client.send(JSON.stringify(testMessage));

    // Perform assertions on the response
    await waitSocketState(client, client.CLOSED);
    expect(testMessage).toBe(messages[0]);
  });
});
