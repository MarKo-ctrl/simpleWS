const WebSocket = require('ws');
const { serverStart, waitSocketState } = require('../webSocketTestUtils');

const port = 3000;

describe("WebSocket Server", () => {
  let server;

  beforeAll(async () => {
    server = await serverStart(port)
  });

  afterAll(() => server.close());

  it("Server echoes the message it receives from client", async () => {
    // Create test client
    const client = new WebSocket(`ws://localhost:${port}`)
    
    const testMessage = 'This is a test message';
    let responseMessage;

    await waitSocketState(client, client.OPEN);
    
    client.on('message', (data) => {
      responseMessage = JSON.parse(data);
      // Close the client after it receives the response
      client.close()
    });
    
    // Send client message
    client.send(JSON.stringify(testMessage));

    // Perform assertions on the response
    await waitSocketState(client, client.CLOSED);
    expect(responseMessage).toBe(testMessage);
  });
});
