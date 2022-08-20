## Classes

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

**Kind**: global class  
<a name="new_AxiosTransportOptions_new"></a>

### new AxiosTransportOptions(host, path, auth, authType, method, headers)

| Param | Type | Description |
| --- | --- | --- |
| host | <code>string</code> | The host to send the logs to. |
| path | <code>string</code> | The path to send the logs to. This will resolve to host + path. |
| auth | <code>string</code> | The authentication token to send with the logs. Will override any auth headers provided in [headers](headers). |
| authType | <code>TransportAuthType</code> | The type of authentication to use. |
| method | <code>TransportMethod</code> | The method to use when sending the logs. |
| headers | <code>AxiosRequestHeaders</code> | The headers to send with the logs. |

<a name="AxiosTransport"></a>

## AxiosTransport
Transport for Winston that sends log messages to a remote server using Axios.

**Kind**: global class  
**See**: [AxiosTransportOptions](#AxiosTransportOptions)  
<a name="new_AxiosTransport_new"></a>

### new exports.AxiosTransport(options)

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>AxiosTransportOptions</code>](#AxiosTransportOptions) | The options for the transport. |

**Example**  
```js
const logger = createLogger({  transports: [    new AxiosTransport({      host: 'http://localhost:3000',      path: '/logs'    }),  ],});logger.log({ level: 'info', message: 'Hello World' });
```
