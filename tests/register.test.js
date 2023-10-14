const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const user = {
  username: 'testuser',
  email: 'test@example.com',
  password: '1234',
};

describe('POST /signup', () => {
  it('Crea un nuevo usuario y retorna 200, token y auth: true', async () => {
    const res = await request(app)
        .post('/signup')
        .send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('auth', true);
  });
});