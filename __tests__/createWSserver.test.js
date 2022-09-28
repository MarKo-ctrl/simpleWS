const WebSocket = require('ws');
const { serverStart, waitSocketState, createSocketClient } = require('../webSocketTestUtils');

const port = 3000;

beforeAll(async () => {
  server = await serverStart(port)
});

afterAll(() => server.close());

describe("WebSocket Server", () => {
  it ('Server echoes the message it receives from client', async () => {
    const testMessage = { type: 'ECHO', value: 'This is a test message' };

    // Create test client
    const [client, messages] = await createSocketClient(port, 1);

    // Send client message
    client.send(JSON.stringify(testMessage));

    // Perform assertions on the response
    await waitSocketState(client, client.CLOSED);
    expect(messages[0]).toBe(testMessage.value);
  });

  it ('When given an ECHO_TIMES_3 message, the server echoes the message it receives from the client three times', async () => {
    const testMessage = { type: 'ECHO_TIMES_3', value: 'You will read me three times' };
    const expectedMessages = [...Array(3)].map(() => testMessage.value);
    
    // Create test client
    const [client, messages] = await createSocketClient(port, 3);

    // Send client message
    client.send(JSON.stringify(testMessage));

    // Performs assertions on the response
    await waitSocketState(client, client.CLOSED);

    expect(messages).toStrictEqual(expectedMessages);
    expect(messages.length).toBe(3);
  });
});
