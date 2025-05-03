import Transport from 'winston-transport';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

type TransportAuthType = 'bearer' | 'apikey' | 'basic' | 'custom' | 'none';
type TransportMethod = 'POST' | 'PUT';

/**
 * Options for Axios Transport.
 * @param {string} url - The url to send the logs to.
 * @param {string} path - The path to send the logs to. The destination url will resolve to url + path.
 * @param {string} auth - The authentication token to send with the logs. Will override any auth headers provided in {@link headers}.
 * @param {TransportAuthType} authType - The type of authentication to use.
 * @param {TransportMethod} method - The method to use when sending the logs.
 * @param {AxiosRequestHeaders} headers - The headers to send with the logs.
 */
interface AxiosTransportOptions extends Transport.TransportStreamOptions {
  axiosInstance: AxiosInstance;
  url?: string;
  path?: string;
  auth?: string;
  authType?: TransportAuthType;
  method?: TransportMethod;
  headers?: AxiosRequestHeaders;
  bodyAddons?: object;
  host?: string; // @deprecated use url instead
  replacer?: (key: string, value: any) => any;
}

/**
 * Transport for Winston that sends log messages to a remote server using Axios.
 * @param {AxiosTransportOptions} options - The options for the transport.
 * @see {@link AxiosTransportOptions}
 * @example
 * const logger = createLogger({
 *   transports: [
 *     new AxiosTransport({
 *       url: 'http://localhost:3000',
 *       path: '/logs'
 *     }),
 *   ],
 * });
 * logger.log({ level: 'info', message: 'Hello World' });
 */
export class AxiosTransport extends Transport {
  axiosInstance: AxiosInstance;
  url: string;
  path?: string;
  auth?: string;
  authType?: TransportAuthType;
  method?: TransportMethod;
  headers?: AxiosRequestHeaders;
  bodyAddons?: object;
  

  constructor(opts: AxiosTransportOptions = { axiosInstance: axios.create() }) {
    super(opts);
    this.axiosInstance = opts.axiosInstance;
    this.url = opts.url || opts.host || 'http://localhost:80';
    this.path = opts.path;
    this.auth = opts.auth;
    this.authType = opts.authType;
    this.method = opts.method || 'POST';
    this.headers = opts.headers;
    this.bodyAddons = opts.bodyAddons;
  }

  async log(info: any, callback: () => void) {
    // setImmediate(() => {
    //   this.emit('logged', info);
    // });

    // Resolve the destination url.
    let resolvedUrl = this.url;
    if (this.path) {
      let resolvedPath = this.path;
      if (resolvedUrl.endsWith('/')) {
        resolvedUrl = resolvedUrl.slice(0, -1);
      }
      if (!resolvedPath.startsWith('/')) {
        resolvedPath = '/' + resolvedPath;
      }
      resolvedUrl = resolvedUrl + resolvedPath;
    }

    // Add body addons to the request body if they exist.
    if (this.bodyAddons) {
      info = { ...info, ...this.bodyAddons };
    }
    info['@timestamp'] = info.timestamp;
    delete info.timestamp;

    // Create the request config.
    let axiosConfig: AxiosRequestConfig<any> = {
      method: this.method,
      url: resolvedUrl,
      data: info,
    };

    // Validate and format headers
    if (this.headers) {
      // If auth is provided but also defined in headers, remove it from headers
      if (this.headers.authorization && this.auth) {
        delete this.headers.authorization;
      }

      // If headers are defined, add them to the axios config
      if (Object.keys(this.headers).length > 0) {
        axiosConfig = { ...axiosConfig, headers: this.headers };
      }
    }

    // If auth is defined, add it to the axios config
    if (this.auth) {
      const authType = this.authType || 'bearer';
      let authPrefix;
      switch (authType) {
        case 'bearer':
          authPrefix = 'Bearer ';
          break;
        case 'apikey':
          authPrefix = 'ApiKey ';
          break;
        case 'basic':
          authPrefix = 'Basic ';
          break;
        default:
          authPrefix = '';
          break;
      }
      const authHeader = `${authPrefix}${this.auth}`;
      if (axiosConfig.headers) {
        axiosConfig.headers = { ...axiosConfig.headers, authorization: authHeader };
      } else {
        axiosConfig.headers = { authorization: authHeader };
      }
    }

    // Send the request.
    console.log('Send the request with the following config:');
    console.log(axiosConfig);
    console.log(JSON.stringify(axiosConfig));

    try {
      await this.axiosInstance.post(String(axiosConfig.url), axiosConfig.data, axiosConfig);
      // await this.axiosInstance(axiosConfig);
      this.emit("logged", info);
    } catch (err) {
      this.emit("error", err);
    } finally {
      console.log('Callback should be fired here');
      callback();
    }
  }
}

module.exports = {
  AxiosTransport,
};
