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
  test('should exit application if redis fails to connect', async () => {
    // This test is a bit messy. If redisClient fails to connect, the application exits, but that happens AFTER createSession has returned
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(number => {
      console.log('Mock process.exit with code', number)
    })

    const options = {
      key: 'MY_REDIS',
      sessionOptions: {
        secret: '1234',
      },
      useRedis: true,
    }

    await new Promise((resolve, reject) => {
      mockRedisClient.connect.mockRejectedValue('fail')
      createSession(options)

      setTimeout(() => {
        try {
          expect(mockExit).toHaveBeenCalledWith(1)
          mockExit.mockRestore()
          resolve()
        } catch (e) {
          console.log(e)
          mockExit.mockRestore()
          reject('Test failed')
        }
      }, 10)
    })
  })
})
