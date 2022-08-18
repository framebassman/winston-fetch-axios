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

export class AxiosTransport extends Transport {
  host: string;
  auth: string;
  path: string;

  constructor(opts: AxiosTransportOptions) {
    super(opts);
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

    callback();
  }
}

module.exports = {
  AxiosTransport,
};
