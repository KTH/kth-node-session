'use strict'

const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redis = require('redis')

const oneHour = 3600 // time in seconds!

const defaults = {
  useRedis: false,
  key: '',

  redisOptions: {
    host: 'localhost',
    port: 6379,
    ttl: oneHour,
  },
  sessionOptions: {
    secret: '',
    resave: true, // update time to live on usage
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true, sameSite: 'Lax', path: '/' },
    proxy: true,
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

  if (!options.redisOptions.prefix) {
    if (options.key) {
      options.redisOptions.prefix = `${options.key}:`
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
    redisClient = redis.createClient(options.redisOptions)
    options.sessionOptions.store = new RedisStore({ client: redisClient })
  }
  return session(options.sessionOptions)
}
