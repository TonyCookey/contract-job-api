const request = require('supertest');

const app = require('../app')

describe('Test API Server is alive and responding ', () => {
    test('It should respond with 200 success', async () => {
        await request(app)
            .get('/')
            .expect('Content-Type', /json/)
            .expect(200);
    });
});