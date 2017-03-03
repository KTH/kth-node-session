/* eslint-env mocha */

const createSession = require('../../')
const expect = require('chai').expect

describe('Session', function () {
  it('should not allow a session without secret', function () {
    try {
      const options = {
        key: 'MY_REDIS'
      }
      let session = createSession(options)
      expect(session).to.be.undefined
    } catch (err) {
      expect(err).to.not.be.undefined
    }
  })
  it('should not allow a session without a redis key', function () {
    try {
      const options = {
        sessionOptions: {
          secret: '1234'
        }
      }
      let session = createSession(options)
      expect(session).to.be.undefined
    } catch (err) {
      expect(err).to.not.be.undefined
    }
  })
  it('should return a session middleware', function () {
    const options = {
      key: 'MY_REDIS',
      sessionOptions: {
        secret: '1234'
      },
      useRedis: true
    }
    const session = createSession(options)
    expect(session.constructor.name).to.be.equal('Function')
  })
})
