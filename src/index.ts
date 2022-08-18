import { createLogger, transports, format } from 'winston';
import Transport from 'winston-transport';
import axios from 'axios';

interface AxiosTransportOptions extends Transport.TransportStreamOptions {
  host: string;
  auth: string;
  path: string;
  headers?: object;
  batch?: boolean;
  batchInterval?: number;
  batchCount?: number;
  replacer?: (key: string, value: any) => any;
}

//
// Inherit from `winston-transport` so you can take advantage
// of the base functionality and `.exceptions.handle()`.
//
export class AxiosTransport extends Transport {
  host: string;
  auth: string;
  path: string;

  constructor(opts: AxiosTransportOptions) {
    super(opts);

    //
    // Consume any custom options here. e.g.:
    // - Connection information for databases
    // - Authentication information for APIs (e.g. loggly, papertrail,
    //   logentries, etc.).
    //
    this.host = opts.host;
    this.auth = opts.auth;
    this.path = opts.path;
  }

  log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    axios
      .post(this.host + this.path, info, {
        headers: { Authorization: 'Bearer ' + this.auth },
      })
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return error;
      });

    // Perform the writing to the remote service

    callback();
  }
}

module.exports = {
  AxiosTransport,
};
