# kth-node-session [![Build Status](https://travis-ci.org/KTH/kth-node-session.svg?branch=master)](https://travis-ci.org/KTH/kth-node-session)

A Node.js module for setting up session middleware for Express.js apps.

Enforces certain defaults that should improve security related to sessions.

Available session options: https://www.npmjs.com/package/express-session

Available Redis options: https://www.npmjs.com/package/connect-redis

# Usage

```javascript
const express = require('express')
const session = require('kth-node-session')

const app = express()

const options = {
  // set to true to enable session storage in RedisStore
  // default is to use MemoryStore
  useRedis: false,

  // this is used as redis prefix and session cookie name
  // must be set here or as individual settings for redis (prefix) and session (name)
  key: 'node-app.sid',

  // https://www.npmjs.com/package/connect-redis
  redisOptions: {
    // ...
  },

  // https://www.npmjs.com/package/express-session
  sessionOptions: {
    // secret must be set!
    secret: 'my-secret-string',

    // this should not be set when enabling Redis
    // or if using the default value
    store: null,
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
