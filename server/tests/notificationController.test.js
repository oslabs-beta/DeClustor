const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const notificationController = require('../controllers/notificationController')
const redisClient = require('../controllers/redisClient')

jest.mock('sqlite3', () => {
  const mockDbRun = jest.fn((sql, params, callback) => {
    callback(null)
  })

  return {
    Database: jest.fn(() => ({
      run: mockDbRun,
    })),
  }
})

jest.mock('../controllers/redisClient', () => ({
  keys: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
}))

const app = express()
app.use(bodyParser.json())
app.post(
  '/setNotification',
  notificationController.setNotification,
  (req, res) => {
    res.status(200).send('Notification settings saved')
  }
)

app.use((err, req, res) => {
  res.status(err.status || 500).json({ message: err.message })
})

describe('notificationController tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should save notifications if all fields are valid', async () => {
    const response = await request(app)
      .post('/setNotification')
      .query({
        userId: 1,
        accountName: 'testAccount',
        clusterName: 'testCluster',
        region: 'us-east-1',
      })
      .send({
        notifications: [
          { metric: 'NetworkRxBytes', threshold: 100, operator: 'greaterThan' },
          {
            metric: 'CPUUtilization',
            applyToAllServices: {
              threshold: 80,
              operator: 'greaterThanOrEqual',
            },
          },
          {
            metric: 'MemoryUtilization',
            services: { service1: { threshold: 70, operator: 'lessThan' } },
          },
        ],
      })

    expect(response.status).toBe(200)
    expect(response.text).toBe('Notification settings saved')
  })

  test('should handle notifications check correctly', async () => {
    const ws = {
      send: jest.fn(),
      close: jest.fn(),
    }

    redisClient.keys.mockResolvedValue([
      'notification:testUser:1',
      'notification:testUser:2',
    ])
    redisClient.get
      .mockResolvedValueOnce(
        JSON.stringify({ metric: 'CPUUtilization', value: 90 })
      )
      .mockResolvedValueOnce(
        JSON.stringify({ metric: 'MemoryUtilization', value: 80 })
      )
    redisClient.del.mockResolvedValue(1)

    await notificationController.handleNotificationCheck(ws, 'testUser')

    expect(ws.send).toHaveBeenCalledWith(
      JSON.stringify([
        { metric: 'CPUUtilization', value: 90 },
        { metric: 'MemoryUtilization', value: 80 },
      ])
    )
  })

  test('should handle no new notifications', async () => {
    const ws = {
      send: jest.fn(),
      close: jest.fn(),
    }

    redisClient.keys.mockResolvedValue([])

    await notificationController.handleNotificationCheck(ws, 'testUser')

    expect(ws.send).toHaveBeenCalledWith(
      JSON.stringify({ message: 'No new notifications' })
    )
  })

  test('should handle errors during notifications check', async () => {
    const ws = {
      send: jest.fn(),
      close: jest.fn(),
    }

    redisClient.keys.mockRejectedValue(new Error('Redis error'))

    await notificationController.handleNotificationCheck(ws, 'testUser')

    expect(ws.send).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Error checking notifications, Error: Redis error',
      })
    )
    expect(ws.close).toHaveBeenCalled()
  })
})
