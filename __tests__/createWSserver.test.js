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

  it ("When given a MESSAGE_GROUP message, the server echoes the message it receives to everyone in the specified group", async () => {
    const testMessage = "This is a test message";
    const creationMessage = { type: "CREATE_GROUP", value: "TEST_GROUP" };

    // Create test clients
    const [client1, messages1] = await createSocketClient(port);
    const [client2, messages2] = await createSocketClient(port, 2);
    const [client3, messages3] = await createSocketClient(port);

    // Setup test clients to send messages and close in the right order
    client1.on("message", (data) => {
      
      if (JSON.parse(data) === creationMessage.value) {
        const joinMessage = { type: "JOIN_GROUP", value: JSON.parse(data) };
        const groupMessage = {
          type: "MESSAGE_GROUP",
          value: { groupName: JSON.parse(data), groupMessage: testMessage },
        };
        client2.send(JSON.stringify(joinMessage));
        client2.send(JSON.stringify(groupMessage));
      }
    });

    client2.on("close", () => {
      client1.close();
      client3.close();
    });

    // Send client message
    client1.send(JSON.stringify(creationMessage));    

    // Perform assertions on the responses
    await waitSocketState(client1, client1.CLOSED);
    await waitSocketState(client2, client2.CLOSED);
    await waitSocketState(client3, client3.CLOSED);

    const [group1, message1] = messages1;
    const [group2, message2] = messages2;

    // Both client1 and client2 should have joined the same group.
    expect(group1).toBe(creationMessage.value);
    expect(group2).toBe(creationMessage.value);

    // Both client1 and client2 should have received the group message.
    expect(message1).toBe(testMessage);
    expect(message2).toBe(testMessage);

    // client3 should have received no messages
    expect(messages3.length).toBe(0);
  });
});
