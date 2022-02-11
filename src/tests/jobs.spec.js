const request = require('supertest');

const app = require('../app')

const authProfile = {
    id: 6,
    firstName: 'Linus',
    lastName: 'Torvalds',
    profession: 'Programmer',
    balance: 1214,
    type: 'contractor'
}

const noActiveContractProfile = {
    id: 5,
    firstName: 'John',
    lastName: 'Lenon',
    profession: 'Musician',
    balance: 64,
    type: 'contractor'
}
describe('TEST - Fetch Job Controller Endpoint - /jobs/unpaid', () => {

    describe('PASS - Fetch unpaid jobs that belong to an active contract for an authenticated Profile ', () => {
        test('It should respond with 200 OK', async () => {
            await request(app)
                .get(`/jobs/unpaid`)
                .set('profile_id', authProfile.id)
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });

    describe('FAIL - Fetch unpaid jobs that belong to an active contract for an unathenticated Profile ', () => {
        test('It should respond with 401 Unauthorized', async () => {
            await request(app)
                .get(`/jobs/unpaid`)
                .expect('Content-Type', /json/)
                .expect(401);
        });

    });

    describe('FAIL - Fetch unpaid jobs that does not belong to an active contract ', () => {
        test('It should respond with 404 Not Found', async () => {
            await request(app)
                .get(`/jobs/unpaid`)
                .set('profile_id', noActiveContractProfile.id)
                .expect('Content-Type', /json/)
                .expect(404);
        });
    });
})
// testing the /contracts endpoint
describe('TEST -  Job Controller Endpoint - /jobs/:job_id/pay', () => {
    describe('PASS - pay the contractor for the job ', () => {
        test('It should respond with 200 OK', async () => {

            const response = await request(app)
                .post(`/jobs/2/pay`)
                .set('profile_id', 1)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.message).toBe('Successfully paid contractor for this job');
            expect(response.body.result).not.toBeNull();
        });
    })
    describe('FAIL - pay the contractor for the job that has been paid for', () => {
        test('It should respond with 403 Forbidden', async () => {

            const response = await request(app)
                .post(`/jobs/2/pay`)
                .set('profile_id', 1)
                .expect('Content-Type', /json/)
                .expect(403);

            expect(response.body.message).toBe('The contractor has already been paid for this job');
        });
    })

    describe('FAIL - Fetch a job that does not exist ', () => {
        test('It should respond with 404 Not Found', async () => {
            const response = await request(app)
                .post(`/jobs/100/pay`)
                .set('profile_id', 1)
                .expect('Content-Type', /json/)
                .expect(404);
            expect(response.body.message).toBe('Could not find the requested job')
        });
    });
    describe('FAIL - Fetch a job that does not belong to the authenticated user ', () => {
        test('It should respond with 403 Forbidden', async () => {
            await request(app)
                .post(`/jobs/1/pay`)
                .set('profile_id', 4)
                .expect('Content-Type', /json/)
                .expect(403);
        });
    });


});
