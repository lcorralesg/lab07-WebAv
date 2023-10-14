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
    username: 'tokenuser',
    email: 'tokenuser@example.com',
    password: '1234',
};

describe('GET /dashboard', () => {
    it('Se verifico el token y retorna 200', async () => {
        //Se crea el usuario para obtener el token
        await request(app)
            .post('/signup')
            .send(user);
        //Se obtiene el token
        const res = await request(app)
            .post('/signin')
            .send(user);

        const token = res.body.token;

        //Se verifica el token
        const res2 = await request(app)
            .get('/dashboard')
            .set('x-access-token', token);
        expect(res2.statusCode).toEqual(200);
    });
});

describe('GET /dashboard', () => {
    it('No se envia el token y retorna 401', async () => {
        const res = await request(app)
            .get('/dashboard');
        expect(res.statusCode).toEqual(401);
    });
});

describe('GET /dashboard', () => {
    it('Se envia un token invalido y retorna 500', async () => {
        const res = await request(app)
            .get('/dashboard')
            .set('x-access-token', 'tokeninvalido');
        expect(res.statusCode).toEqual(500);
    });
});