# Winston-Axios

[![Build](https://github.com/Aerilym/winston-axios/actions/workflows/build.yml/badge.svg)](https://github.com/Aerilym/winston-axios/actions/workflows/build.yml)
[![npm version](https://badge.fury.io/js/winston-axios.svg)](https://badge.fury.io/js/winston-axios)
[![Known Vulnerabilities](https://snyk.io/test/github/aerilym/winston-axios/badge.svg)](https://snyk.io/test/github/aerilym/winston-axios)

An axios transport for winston which allows for sending REST requests to an external API.

## Usage

### Setup

```JavaScript
const { AxiosTransport } = require('winston-axios');
```

or

```TypeScript
import { AxiosTransport } from 'winston-axios';
```

### Create a logger with an Axios Transport

```JavaScript
const winston = require('winston');
const { AxiosTransport } = require('winston-axios');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new AxiosTransport({
      url: 'http://localhost:9999',
      path: '/log',
      auth: 'abc123',
    }),
  ],
});
```

### Add an Axios Transport to an existing logger

```JavaScript
const { AxiosTransport } = require('winston-axios');

logger.add(
  new AxiosTransport({
    host: 'http://localhost:9999/log'
  })
);
```

### Receiving the log message

You can simply use `logger.info(request.body);` to log the request in the external API as Winston can resolve the body.

More information on body formatting is to come.

## Example

A production example of using this transport is available here: [photoprism-helper logger.ts](https://github.com/Aerilym/photoprism-helper/tree/master/src/logger.ts)

Here is the relevant code, omitting anything not relevant to the transport:

```TypeScript
import { createLogger, transports } from 'winston';
import { AxiosTransport } from 'winston-axios';

const config = {
  levelConsole: 'info',
  url: 'http://apiurl.com'
  key: 'abc123'
}
//.code here.//

// Create a logger instance with custom settings
export const logger = createLogger({
  transports: [
    new transports.Console({ level: config.levelConsole }),
    //.code here.//
  ],
    //.code here.//
});

//.code here.//

// Add an Axios transport to the logger instance
logger.add(
  new AxiosTransport({
    url: config.url,
    path: '/log',
    auth: config.key,
  })
);
```

## Documentation

<dl>
<dt><a href="#AxiosTransportOptions">AxiosTransportOptions</a></dt>
<dd><p>Options for Axios Transport.</p>
</dd>
<dt><a href="#AxiosTransport">AxiosTransport</a></dt>
<dd><p>Transport for Winston that sends log messages to a remote server using Axios.</p>
</dd>
</dl>

<a name="AxiosTransportOptions"></a>

## AxiosTransportOptions

Options for Axios Transport.

| Param    | Type                             | Description                                                                                         |
| -------- | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| url      | <code>string</code>              | The url to send the logs to.                                                                        |
| path     | <code>string</code>              | The path to send the logs to. The destination url will resolve to url + path.                       |
| auth     | <code>string</code>              | The authentication token to send with the logs. Will override any auth headers provided in headers. |
| authType | <code>TransportAuthType</code>   | The type of authentication to use.                                                                  |
| method   | <code>TransportMethod</code>     | The method to use when sending the logs.                                                            |
| headers  | <code>AxiosRequestHeaders</code> | The headers to send with the logs.                                                                  |

<a name="AxiosTransport"></a>

## AxiosTransport

Transport for Winston that sends log messages to a remote server using Axios.

**See**: [AxiosTransportOptions](#AxiosTransportOptions)  
<a name="new_AxiosTransport_new"></a>

### new AxiosTransport(options)

| Param   | Type                                                         | Description                    |
| ------- | ------------------------------------------------------------ | ------------------------------ |
| options | [<code>AxiosTransportOptions</code>](#AxiosTransportOptions) | The options for the transport. |

**Example**

```js
const logger = createLogger({
  transports: [
    new AxiosTransport({
      url: 'http://localhost:3000',
      path: '/logs',
    }),
  ],
});
logger.log({ level: 'info', message: 'Hello World' });
```
