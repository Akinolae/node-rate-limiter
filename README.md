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

## `express.js node.js`

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

## `@nestJS and graphQL`

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
      request: req,
      session_no: 6,
      ttl: context.getArgByIndex(2).req,
    });

    // auth calls go here
  } catch (e) {
    throw e;
  }
};
```
