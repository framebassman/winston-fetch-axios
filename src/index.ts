import Transport from 'winston-transport';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import path from 'node:path';

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
  

  constructor(opts: AxiosTransportOptions = { }) {
    super(opts);
    this.axiosInstance = axios.create(
      { adapter: 'fetch' }
    )
    this.url = opts.url || opts.host || 'http://localhost:80';
    this.path = opts.path;
    this.auth = opts.auth;
    this.authType = opts.authType;
    this.method = opts.method || 'POST';
    this.headers = opts.headers;
    this.bodyAddons = opts.bodyAddons;
  }

  async log(info: any, callback: () => void) {
    // Resolve the destination url.
    let resolvedUrl = path.join(this.url, String(this.path));

    // Add body addons to the request body if they exist.
    if (this.bodyAddons) {
      info = { ...info, ...this.bodyAddons };
    }
    if (info.timestamp === undefined) {
      Object.defineProperty(info, '@timestamp', {
        value: new Date().toISOString(),
      });
      Object.defineProperty(info, 'timestamp', {
        value: new Date().toISOString(),
      });
    } else {
      Object.defineProperty(info, '@timestamp', {
        value: info.timestamp,
      });
    }

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
    console.debug('Send the request with the following config:');
    console.debug(axiosConfig);
    console.debug(JSON.stringify(axiosConfig));

    try {
      if (this.method === 'POST') {
        await this.axiosInstance.post(resolvedUrl, axiosConfig.data, axiosConfig);
      } else {
        await this.axiosInstance.put(resolvedUrl, axiosConfig.data, axiosConfig);
      }
      this.emit("logged", info);
    } catch (err) {
      this.emit("error", err);
    } finally {
      console.debug('Callback should be fired here');
      callback();
    }
  }
}

module.exports = {
  AxiosTransport,
};
