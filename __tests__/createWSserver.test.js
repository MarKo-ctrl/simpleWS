const { serverStart } = require('../webSocketTestUtils');

const port = 3000;

describe("WebSocket Server", () => {
  let server;

  beforeAll(async () => {
    server = await serverStart(port)
  });

  afterAll(() => server.close());

  it("Server echoes the message it receives from client", () => {
    // 1. Create test client
    // 2. Send client message
    // 3. Close the client after it receives the response
    // 4. Perform assertions on the response
  });
});
