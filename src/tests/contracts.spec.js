const e = require('express');
const request = require('supertest');

const app = require('../app')

const authProfile = {
    id: 1,
    firstName: 'Harry',
    lastName: 'Potter',
    profession: 'Wizard',
    balance: 1150,
    type: 'client'
}

const authProfileContract = {
    id: 1,
    terms: 'bla bla bla',
    status: 'terminated',
    ClientId: 1,
    ContractorId: 5
}
const sampleContract = {
    id: 3,
    terms: 'bla bla bla',
    status: 'in_progress',
    ClientId: 2,
    ContractorId: 6
}

describe('TEST - Fetch a single contract for an authenticated Profile ', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
            .get(`/contracts/${authProfileContract.id}`)
            .set('profile_id', authProfile.id)
            .expect('Content-Type', /json/)
            .expect(200);
    });
});

describe('FAIL - Fetch a single contract for an unathenticated Profile ', () => {
    test('It should respond with 401 Unauthorized', async () => {
        const response = await request(app)
            .get(`/contracts/${authProfileContract.id}`)
            .expect('Content-Type', /json/)
            .expect(401);
    });
});

describe('FAIL - Fetch a single contract that does not exist ', () => {
    test('It should respond with 404 Not Found', async () => {
        const response = await request(app)
            .get(`/contracts/500`)
            .set('profile_id', authProfile.id)
            .expect('Content-Type', /json/)
            .expect(404);
    });
});
describe('FAIL - Fetch a single contract that does not belong to the authenticated user ', () => {
    test('It should respond with 404 Not Found', async () => {
        const response = await request(app)
            .get(`/contracts/${sampleContract.id}`)
            .set('profile_id', authProfile.id)
            .expect('Content-Type', /json/)
            .expect(404);
    });
});