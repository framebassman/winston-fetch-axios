# Winston-Axios

WIP

## Usage

```TypeScript
import { createLogger, transports, format } from 'winston';
import { AxiosTransport } from 'winston-axios';

// Create a logger instance with custom settings
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new AxiosTransport({
      level: 'info',
      auth: 'abc123',
      host: 'http://localhost:3000',
      path: '/log',
    })
  ],
});

```
