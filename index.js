'use strict'

const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const _ = require('lodash')

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
  },
  proxy:true,
}

module.exports = function (options) {
  options = _.defaultsDeep(options, defaults)

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
    options.sessionOptions.store = new RedisStore(options.redisOptions)
  }

  return session(options.sessionOptions)
}
