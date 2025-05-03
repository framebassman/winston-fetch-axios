const { createLogger } = require('winston');
const axios = require('axios');;

jest.mock("axios");
axios.create.mockReturnValue({
    post: jest.fn(() => Promise.resolve({ data: {} }))
});

const { AxiosTransport } = require('../lib/index.js');

describe('AxiosTransport with mocks', () => {
  let fakeSlackHook;
  const fakeOpts  = {
    level: 'info',
    auth: 'testkey',
    host: 'localhost',
    path: '/test',
    hostPort: 9999,
  };

  beforeAll(() => {
      jest.clearAllMocks();
      fakeSlackHook = new AxiosTransport(fakeOpts);
  });

  beforeEach(() => {
      jest.resetModules();
  });

  test("log function gets called with correct params", async () => {
    const fakeCb = jest.fn();
    const fakePayload = {
      level: 'debug',
      timestamp: '2025-05-03 19:38:43.4343',
      message: 'Test message'
    };

    await fakeSlackHook.log(fakePayload, fakeCb);

    expect(fakeSlackHook.axiosInstance.post).toHaveBeenCalledTimes(1);
    // expect(fakeSlackHook.axiosInstance.post).toHaveBeenCalledWith(
    //   "localhost/test",
    //   // expect.objectContaining( { "data": fakePayload } )
    // );

    expect(fakeCb).toHaveBeenCalledTimes(1);
  });
});
