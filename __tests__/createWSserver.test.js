const WebSocket = require('ws');
const { serverStart, waitSocketState, createSocketClient } = require('../webSocketTestUtils');

const port = 3000;

beforeAll(async () => {
  server = await serverStart(port)
});

afterAll(() => server.close());

describe("WebSocket Server", () => {
  it('Server echoes the message it receives from client', async () => {
    const testMessage = { type: 'ECHO', value: 'This is a test message' };

    // Create test client
    const [client, messages] = await createSocketClient(port, 1);

    // Send client message
    client.send(JSON.stringify(testMessage));

    // Perform assertions on the response
    await waitSocketState(client, client.CLOSED);
    expect(messages[0]).toBe(testMessage.value);
  });

  it('When given an ECHO_TIMES_3 message, the server echoes the message it receives from the client three times', async () => {
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

  it('When given an ECHO_TO_ALL message, the server sends the message it receives to all clients', async () => {
    const testMessage = { type: 'ECHO_TO_ALL', value: 'This message is sent to many clients' };

    // Create test clients
    const [client1, messages1] = await createSocketClient(port, 1);
    const [client2, messages2] = await createSocketClient(port, 1);
    const [client3, messages3] = await createSocketClient(port, 1);


    // Send client message
    client1.send(JSON.stringify(testMessage));

    // Perform assertions on the responses
    await waitSocketState(client1, client1.CLOSED);
    await waitSocketState(client2, client2.CLOSED);
    await waitSocketState(client3, client3.CLOSED);

    expect(messages1[0]).toBe(testMessage.value);
    expect(messages2[0]).toBe(testMessage.value);
    expect(messages3[0]).toBe(testMessage.value);
  });

  
});
