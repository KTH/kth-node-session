const mockRedisClient = {
  connect: jest.fn(),
}
mockRedisClient.connect.mockResolvedValue(mockRedisClient)

jest.mock('kth-node-redis', () => ({
  createClient: jest.fn().mockImplementation(() => mockRedisClient),
}))

describe(`Session`, () => {
  afterAll(() => jest.resetAllMocks())

  let createSession

  beforeEach(() => {
    mockRedisClient.connect.mockResolvedValue(mockRedisClient)

    jest.resetModules()
    createSession = require('./index')
  })

  afterEach(() => {})

  test('should not allow a session without a redis key', () => {
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
  test('should not allow a session without secret', () => {
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
  test('should force an exception if redisClient.connect fails', async () => {
    const RedisError = new Error('connect failed')
    mockRedisClient.connect.mockRejectedValue(RedisError)

    const options = {
      key: 'MY_REDIS',
      sessionOptions: {
        secret: '1234',
      },
      useRedis: true,
    }

    let nextTickFunction
    const nextTickSpy = jest.spyOn(process, 'nextTick').mockImplementation(fn => {
      nextTickFunction = fn // capture but don't run yet
    })

    createSession(options)

    // Wait for the next tick to let the async throw happen
    await new Promise(resolve => setImmediate(resolve))

    // Check that process.nextTick has been executed
    expect(nextTickSpy).toHaveBeenCalled()
    expect(typeof nextTickFunction).toBe('function')

    // Catch the error that gets thrown in process.nextTick
    const thrownError = (() => {
      try {
        nextTickFunction()
      } catch (err) {
        return err
      }
    })()

    expect(thrownError).toBeInstanceOf(Error)
    expect(thrownError.message).toContain('@kth/session redisCLient.connect.error')
    expect(thrownError.cause).toBe(RedisError)

    nextTickSpy.mockRestore()
  })
})
