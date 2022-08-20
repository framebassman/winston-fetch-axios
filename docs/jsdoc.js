/**
 * Options for Axios Transport.
 * @param {string} host - The host to send the logs to.
 * @param {string} path - The path to send the logs to. This will resolve to host + path.
 * @param {string} auth - The authentication token to send with the logs. Will override any auth headers provided in {@link headers}.
 * @param {TransportAuthType} authType - The type of authentication to use.
 * @param {TransportMethod} method - The method to use when sending the logs.
 * @param {AxiosRequestHeaders} headers - The headers to send with the logs.
 */
class AxiosTransportOptions extends Transport.TransportStreamOptions {}

/**
 * Transport for Winston that sends log messages to a remote server using Axios.
 * @param {AxiosTransportOptions} options - The options for the transport.
 * @see {@link AxiosTransportOptions}
 * @example
 * const logger = createLogger({
 *   transports: [
 *     new AxiosTransport({
 *       host: 'http://localhost:3000',
 *       path: '/logs'
 *     }),
 *   ],
 * });
 * logger.log({ level: 'info', message: 'Hello World' });
 */
export class AxiosTransport extends Transport {}
