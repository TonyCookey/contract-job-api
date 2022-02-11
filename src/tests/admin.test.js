const request = require('supertest');

const app = require('../app')

const validStartDate = '2021-02-10'
const validEndDate = '2025-02-10'

describe('TEST - Fetch Admin Controller Endpoint - /admin/best-profession', () => {

    describe('PASS - return the highest paying profession during a date range ', () => {
        test('It should respond with 200 OK', async () => {

            const response = await request(app)
                .get(`/admin/best-profession?start=${validStartDate}&end=${validEndDate}`)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.body.message).toBe(`Successfully returned the highest paying Profession based on paid jobs from '${validStartDate}' - '${validEndDate}'`)
            expect(response.body.profession).not.toBeNull()
            expect(response.body.amountEarned).not.toBeNull()

        });
    })

    describe('FAIL - return highest paying profession without the required date range', () => {
        test('It should respond with 400 Bad Request - Date Range not Supplied', async () => {
            const response = await request(app)
                .get(`/admin/best-profession`)
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.message).toBe('Could not complete request. date range is required - (start - end)')
        });

    });

    describe('FAIL - return highest paying profession without an invalid date range', () => {
        test('It should respond with 400 Bad Request - Date Range not valid', async () => {
            const response = await request(app)
                .get(`/admin/best-profession?start=${validEndDate}&end=${validStartDate}`)
                .expect('Content-Type', /json/)
                .expect(404);
            expect(response.body.message).toBe('Could not find the highest profession within this date range. Try a wider/valid date range')
        });

    });




})