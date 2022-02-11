const request = require('supertest');

const app = require('../app')

const validStartDate = '2021-02-10'
const invalidStartDate = 'hello'
const validEndDate = '2025-02-10'

describe('TEST - Fetch Admin Controller Endpoint - /admin/best-profession', () => {

    describe('TEST - return the highest paid profession during a date range ', () => {
        test('It should respond with 200 OK', async () => {

            const response = await request(app)
                .get(`/admin/best-profession?start=${validStartDate}&end=${validEndDate}`)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.body.message).toBe(`Successfully returned the highest paid Profession based on paid jobs from '${validStartDate}' - '${validEndDate}'`)
            expect(response.body.profession).not.toBeNull()
            expect(response.body.amountEarned).not.toBeNull()

        });
    })

    describe('TEST - return highest paid profession without the required date range', () => {
        test('It should respond with 400 Bad Request - Date Range not Supplied', async () => {
            const response = await request(app)
                .get(`/admin/best-profession`)
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.message).toBe('Could not complete request. date range is required - (start - end)')
        });

    });
    describe('TEST - return highest paid profession using an invalid date', () => {
        test('It should respond with 400 Bad Request - invalid date', async () => {
            const response = await request(app)
                .get(`/admin/best-profession?start=${invalidStartDate}&end=${validStartDate}`)
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.message).toBe('Could not complete request. please use the valid date format(YY/MM/DD)')
        });

    });

    describe('TEST - return highest paid profession using an invalid date range', () => {
        test('It should respond with 404 Not Found - Date Range not valid', async () => {
            const response = await request(app)
                .get(`/admin/best-profession?start=${validEndDate}&end=${validStartDate}`)
                .expect('Content-Type', /json/)
                .expect(404);
            expect(response.body.message).toBe('Could not find the highest paid profession within this date range')
        });

    });
})


describe('TEST - Fetch Admin Controller Endpoint - /admin/best-clients', () => {

    describe('PASS - return the highest paying profession during a date range ', () => {
        test('It should respond with 200 OK', async () => {

            const response = await request(app)
                .get(`/admin/best-clients?start=${validStartDate}&end=${validEndDate}`)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.body.message).toBe(`Successfully returned the highest paying client based on paid jobs from '${validStartDate}' - '${validEndDate}'`)
            expect(response.body.result).not.toBeNull()
            expect(response.body.result).toHaveLength(2)

        });
    })

    describe('TEST - return highest paying client without the required date range', () => {
        test('It should respond with 400 Bad Request - Date Range not Supplied', async () => {
            const response = await request(app)
                .get(`/admin/best-clients`)
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.message).toBe('Could not complete request. date range is required - (start - end)')
        });

    });

    describe('TEST - return highest paying client using an invalid date', () => {
        test('It should respond with 400 Bad Request - Date Range not Supplied', async () => {
            const response = await request(app)
                .get(`/admin/best-clients?start=${invalidStartDate}&end=${validStartDate}`)
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.message).toBe('Could not complete request. please use the valid date format(YY/MM/DD)')
        });

    });
    describe('TEST - return highest paying clients using out of range dates', () => {
        test('It should respond with 404 Not Found - Date Range not valid', async () => {
            const response = await request(app)
                .get(`/admin/best-clients?start=${validEndDate}&end=${validStartDate}`)
                .expect('Content-Type', /json/)
                .expect(404);
            expect(response.body.message).toBe('Could not find the highest paying client within this date range')
        });

    });
})