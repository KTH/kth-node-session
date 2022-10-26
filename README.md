# @kth/session

A Node.js module for setting up session middleware for Express.js apps.

Enforces certain defaults that should improve security related to sessions.

Available session options: https://www.npmjs.com/package/express-session

Available Redis options: https://www.npmjs.com/package/connect-redis

# Usage

```javascript
const express = require('express')
const session = require('@kth/session')

const app = express()

const options = {
  // Set to true to enable session storage in RedisStore.
  // Default is to use MemoryStore.
  useRedis: false,

  // This is used as redis prefix and session cookie name.
  // Must be set here or as individual settings for redis (prefix) and session (name).
  key: 'node-app.sid',

  // https://www.npmjs.com/package/connect-redis
  redisOptions: {
    // ...
  },

  // https://www.npmjs.com/package/express-session
  sessionOptions: {
    // Secret must be set!
    secret: 'my-secret-string',

    // This should not be set when enabling Redis,
    // or if using the default value.
    store: null,
  },
  // Optional. Currently only used for RedisStore.
  storeOptions: {
    // Time in seconds.
    // Default value is 3600, i.e. one hour.
    ttl: 14400,
  },
}

app.use(session(options))
```

### Default cookie settings

The cookie has the following defult settings but each value can be overridden if needed:

```javascript
cookie: {
  secure: true,
  httpOnly: true,
  sameSite: 'Lax',
  path: '/'
},
```

The path attribute is preferably set to a more specific path so the cookie only is available where it´s needed.
