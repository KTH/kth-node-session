'use strict'

const session = require('express-session')
const { RedisStore } = require('connect-redis')
const { createClient } = require('kth-node-redis')

const oneHour = 3600 // time in seconds!

const defaults = {
  useRedis: false,
  key: '',

  redisOptions: {
    host: 'localhost',
    port: 6379,
  },
  sessionOptions: {
    secret: '',
    resave: true, // update time to live on usage
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true, sameSite: 'Lax', path: '/' },
    proxy: true,
  },
  storeOptions: {
    ttl: oneHour,
  },
}
let redisClient

function createOptions(options) {
  if (typeof options !== 'object') return options
  if (Array.isArray(options)) {
    return [...options]
  }
  const rval = JSON.parse(JSON.stringify(defaults))

  for (const key in options) {
    if (Object.prototype.hasOwnProperty.call(options, key)) {
      if (Array.isArray(options[key])) {
        rval[key] = [...options[key]]
      } else if (typeof options[key] === 'object') {
        rval[key] = { ...rval[key], ...options[key] }
      } else {
        rval[key] = options[key]
      }
    }
  }
  return rval
}

module.exports = function nodeSession(inOptions) {
  const options = createOptions(inOptions, defaults)

  if (!options.storeOptions.prefix) {
    if (options.key) {
      options.storeOptions.prefix = `${options.key}:`
    } else {
      throw new Error('No Redis prefix provided, "options.key" must be set.')
    }
  }

  if (!options.sessionOptions.secret) {
    throw new Error('Session secret must be set.')
  }

  if (!options.sessionOptions.name) {
    if (options.key) {
      options.sessionOptions.name = options.key
    } else {
      throw new Error('No session name provided, "options.key" must be set.')
    }
  }

  if (options.useRedis) {
    redisClient = createClient('session', options.redisOptions)

    redisClient.connect().catch(error => {
      process.nextTick(() => {
        // force an "exception" rather than an "unhandled rejection"
        throw new Error('@kth/session redisCLient.connect.error', { cause: error })
      })
    })

    options.sessionOptions.store = new RedisStore({ ...options.storeOptions, client: redisClient })
  }

  return session(options.sessionOptions)
}
