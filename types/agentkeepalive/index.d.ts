// Type definitions for agentkeepalive 3.4
// Project: https://github.com/node-modules/agentkeepalive/
// Definitions by: Kenneth Aasan <https://github.com/kennethaasan/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.7

declare module 'agentkeepalive' {
  import http from 'http';

  interface IOptions {
    keepAlive?: boolean;
    keepAliveMsecs?: number;
    freeSocketKeepAliveTimeout?: number;
    timeout?: number;
    maxSockets?: number;
    maxFreeSockets?: number;
    socketActiveTTL?: number;
  }

  export class HttpAgent extends http.Agent {
    constructor(options: IOptions);
  }

  export class HttpsAgent extends HttpAgent {}
}
