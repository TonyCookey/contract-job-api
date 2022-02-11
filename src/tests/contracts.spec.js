const request = require('supertest');

const app = require('../app')

const authProfile = {
    id: 4,
    firstName: 'Ash',
    lastName: 'Kethcum',
    profession: 'Pokemon master',
    balance: 1.3,
    type: 'client'
}

const authProfileContract = {
    id: 7,
    terms: 'bla bla bla',
    status: 'in_progress',
    ClientId: 4,
    ContractorId: 7
}
const NoContractProfile = {
    id: 5,
    firstName: 'John',
    lastName: 'Lenon',
    profession: 'Musician',
    balance: 64,
    type: 'contractor'
}
const sampleContract = {
    id: 3,
    terms: 'bla bla bla',
    status: 'in_progress',
    ClientId: 2,
    ContractorId: 6
}
describe('TEST - Fetch Contracts Controller Endpoint - /contracts/:id', () => {

    describe('PASS - Fetch a single contract for an authenticated Profile ', () => {
        test('It should respond with 200 OK', async () => {
            await request(app)
                .get(`/contracts/${authProfileContract.id}`)
                .set('profile_id', authProfile.id)
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });

    describe('TEST - Fetch a single contract for an unathenticated Profile ', () => {
        test('It should respond with 401 Unauthorized', async () => {
            await request(app)
                .get(`/contracts/${authProfileContract.id}`)
                .expect('Content-Type', /json/)
                .expect(401);
        });

    });

    describe('TEST - Fetch a single contract that does not exist ', () => {
        test('It should respond with 404 Not Found', async () => {
            await request(app)
                .get(`/contracts/500`)
                .set('profile_id', authProfile.id)
                .expect('Content-Type', /json/)
                .expect(404);
        });
    });
    describe('TEST - Fetch a single contract that does not belong to the authenticated user ', () => {
        test('It should respond with 404 Not Found', async () => {
            await request(app)
                .get(`/contracts/${sampleContract.id}`)
                .set('profile_id', authProfile.id)
                .expect('Content-Type', /json/)
                .expect(404);
        });
    });
})
// testing the /contracts endpoint
describe('TEST - Fetch Contracts Controller Endpoint - /contracts/', () => {
    describe('PASS - Fetch all unterminated contracts for an authenticated Profile ', () => {
        test('It should respond with 200 OK', async () => {
            const response = await request(app)
                .get(`/contracts`)
                .set('profile_id', authProfile.id)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.message).toBe('successfully returned all unterminated contracts for this profile');
            expect(response.body.result).not.toHaveLength(0);
            expect(response.body.result.length).toBeGreaterThan(0);
        });
        test('It should respond with 200 OK, but with no contracts found', async () => {
            const response = await request(app)
                .get(`/contracts`)
                .set('profile_id', NoContractProfile.id)
                .expect('Content-Type', /json/)
                .expect(404)
            expect(response.body.message).toBe('Could not find non terminated contracts - new or in_progress contracts');
        });
    });

    describe('TEST - Fetch all unterminated contracts for an unathenticated Profile ', () => {
        test('It should respond with 401 Unauthorized', async () => {
            await request(app)
                .get(`/contracts`)
                .expect('Content-Type', /json/)
                .expect(401);
        });
    });

})