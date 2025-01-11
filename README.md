# @akinolae/node-rate-limiter

## `Description`

The @akinolae/node-rate-limiter package provides an efficient and flexible solution for controlling the frequency of API requests or other operations. It helps developers prevent excessive usage, safeguard system resources, and ensure compliance with rate-limiting policies.

This package is particularly useful for managing API usage, protecting backend services from overload, and maintaining fair usage across users or clients.

```
npm i @akinolae/node-rate-limiter
```

```
yarn add @akinolae/node-rate-limiter
```

---

# Usage

Documents are **groups of pages** connected through:

## `express.js`

Usage with express.js node.js

```jsx title="auth/index.ts"
import { requestLimitCore } from '@akinolae/node-rate-limiter';

const makeRequest = async (req: Request, res: Response) => {
  try {
    /***
     * Can make it a middleware for authenticated requests
     *
     */

    requestLimitCore({
      request: req,
      session_no: 6,
      ttl: 6 * 60 * 1000,
    });

    // auth calls go here
  } catch (e) {
    throw e;
  }
};
```

## `@nestJS`

Usage with @nestJs and graphQL

```jsx title="auth/index.ts"
import { requestLimitCore } from '@akinolae/node-rate-limiter';
import { ExecutionContext } from '@nestjs/common';

const makeRequest = async (context: ExecutionContext) => {
  try {
    /***
     * Can make it a middleware for authenticated requests i.e auth-guard
     *
     */

    requestLimitCore({
      request: context.getArgByIndex(2).req,
      session_no: 6,
      ttl: 6 * 60 * 1000,
    });

    // auth calls go here
  } catch (e) {
    throw e;
  }
};
```

### Configuration

| Option     | Type     | Description                                                                    |
| ---------- | -------- | ------------------------------------------------------------------------------ |
| ttl        | `number` | time to live `optional`                                                        |
| session_no | `number` | The number of times a request can be called `optional`                         |
| request    | `object` | The request object that carries the metadata of an incoming request `required` |
