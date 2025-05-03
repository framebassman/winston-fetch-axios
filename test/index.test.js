const express = require('express');
const bodyParser = require('body-parser');

const { AxiosTransport } = require('../lib/index.js');
const winston = require('winston');

class AuthResponse {
  constructor(success, message) {
    this.success = success;
    this.message = message;
  }
}

async function validateAuth(request, apiKey) {
  if (!request.headers) {
    return new AuthResponse(false, 'Request contained no header.');
  }
  if (!request.headers.authorization) {
    return new AuthResponse(false, 'Request contained no authorization header.');
  }
  const authHeader = request.headers.authorization.split(' ');
  if (authHeader.length !== 2 || authHeader[0] !== 'Bearer') {
    return new AuthResponse(false, 'Request authorization header incorrectly formatted.');
  }
  if (authHeader[1] !== apiKey) {
    return new AuthResponse(false, 'Invalid API Key');
  } else {
    return new AuthResponse(true, 'Authenticated');
  }
}

const config = {
  level: 'info',
  auth: 'testkey',
  host: 'http://localhost:',
  path: '/test',
  hostPort: 9999,
};

config.host = config.host + config.hostPort;

const loggerLocal = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// const api = express();
// api.use(bodyParser.urlencoded({ extended: true }));
// api.use(bodyParser.json());
// api.use(bodyParser.raw());

// api.use(function (req, res, next) {
//   validateAuth(req, config.auth).then((authOutcome) => {
//     if (!authOutcome.success) {
//       throw authOutcome.message;
//     }
//     next();
//   });
// });

// api.post(config.path, async (req, res) => {
//   loggerLocal.info(req.body);
//   process.exit(0);
// });

// api.listen(config.hostPort, () => {
//   loggerLocal.info(`Test server listening on ${config.hostPort}`);
// });

// try {
//   // Create a logger instance with custom settings
//   const loggerAxios = winston.createLogger({
//     level: 'info',
//     format: winston.format.json(),
//     transports: [
//       new AxiosTransport({
//         level: 'info',
//         auth: config.auth,
//         host: config.host,
//         path: config.path,
//       }),
//     ],
//   });
//   loggerAxios.info('TESTMESSAGE');
// } catch (error) {
//   throw error;
// }

// Create a logger instance with custom settings
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new AxiosTransport({
      host: 'http://localhost:9999/',
      path: 'log',
      auth: 'abc123',
    }),
  ],
});

describe('winston-fetch-axios', () => {
  let app = null;

  beforeAll(() => {
    const api = express();
    api.use(bodyParser.urlencoded({ extended: true }));
    api.use(bodyParser.json());
    api.use(bodyParser.raw());

    api.use(function (req, res, next) {
      validateAuth(req, config.auth).then((authOutcome) => {
        if (!authOutcome.success) {
          throw authOutcome.message;
        }
        next();
      });
    });

    api.post(config.path, async (req, res) => {
      loggerLocal.info(req.body);
      process.exit(0);
    });

    app = api.listen(config.hostPort, () => {
      loggerLocal.info(`Test server listening on ${config.hostPort}`);
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    app.close();
  })

  it('works', () => {
    expect(1 + 2).toBe(3);
  })
});
