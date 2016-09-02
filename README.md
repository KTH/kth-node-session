# kth-node-session

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
    store: null
  }
}

app.use(session(options))
```
