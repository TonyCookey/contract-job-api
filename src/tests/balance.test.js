const request = require('supertest');

const app = require('../app')


describe('TEST - POST Balance Controller Endpoint - /balances/deposit/:userId', () => {

    describe('PASS - Deposits money into the the the balance of a client ', () => {
        test('It should respond with 200 OK', async () => {
            const response = await request(app)
                .post(`/balances/deposit/2`)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.body.message).toBe('successfully deposited into user account. User balance updated')
        });

    });

    describe('FAIL - Deposits money into the the the balance of a client ', () => {
        test('It should respond with 403 Forbidden', async () => {
            const response = await request(app)
                .post(`/balances/deposit/5`)
                .expect('Content-Type', /json/)
                .expect(403);
            expect(response.body.message).toBe('Could not complete request. This profile has no active contracts')
        });

    });
})