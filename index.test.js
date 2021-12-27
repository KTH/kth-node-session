jest.mock('redis', () => ({
  createClient: jest.fn().mockImplementation(() => ({})),
}))

describe(`Session`, () => {
  afterAll(() => jest.resetAllMocks())

  let createSession

  beforeEach(() => {
    jest.resetModules()
    createSession = require('./index')
  })

  afterEach(() => {})

  test('should not allow a session without secret', () => {
    try {
      const options = {
        key: 'MY_REDIS',
      }
      const session = createSession(options)
      expect(session).toBeUndefined()
    } catch (err) {
      expect(err).not.toBeUndefined()
    }
  })
  test('should not allow a session without a redis key', () => {
    try {
      const options = {
        sessionOptions: {
          secret: '1234',
        },
      }
      const session = createSession(options)
      expect(session).toBeUndefined()
    } catch (err) {
      expect(err).not.toBeUndefined()
    }
  })

  test('should return a session middleware', () => {
    const options = {
      key: 'MY_REDIS',
      sessionOptions: {
        secret: '1234',
      },
      useRedis: true,
    }
    const session = createSession(options)
    expect(session).not.toBeUndefined()
    expect(session.constructor.name).toBe('Function')
  })
})
