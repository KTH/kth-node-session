'use strict'

/*eslint-disable */

const express = require('express')
const url = require('url')
const session = require('../../index')
const app = express()

app.use(
  session({
    useRedis: true,
    key: 'test.sid',
    sessionOptions: {
      secret: 'hello',
      cookie: {
        // should be true in production (requires https)
        secure: false,
      },
    },
  })
)

app.use((req, res, next) => {
  if (req.url === '/') {
    next()
    return
  }

  if (!req.session.views) {
    req.session.views = {}
  }

  const pathname = url.parse(req.url).pathname
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1

  next()
})

app.get('/foo', (req, res) => {
  res.type('text')
  res.send(`/foo viewed ${req.session.views['/foo']} times`)
})

app.get('/bar', (req, res) => {
  res.type('text')
  res.send(`/bar viewed ${req.session.views['/bar']} times`)
})

app.get('/', (req, res) => {
  res.type('text')
  res.send('no session modified')
})

app.listen(4000)
