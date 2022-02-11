const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const app = express();
const ContractController = require('./controllers/ContractController')
const JobController = require('./controllers/JobController')
const BalanceController = require('./controllers/BalanceController')
const AdminController = require('./controllers/AdminController')
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * API Index Route 
 * @returns Welcome Message
 */
app.get('/', async (req, res) => {
    res.status(200).json({
        message: "Welcome to Profile->Contract->Job API"
    })
})


/**
 * Fetch Contract for the Authenticated Profile
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, ContractController.getContractForAuthProfile)

/**
 * Fetch non terminated Contract for the Authenticated Profile - new, in_progress
 * @returns contracts
 */
app.get('/contracts', getProfile, ContractController.getNonTerminatedContractForAuthProfile)

/**
 * Fetch unpaid active contract jobs for an authenticated profile
 * @returns jobs 
 */
app.get('/jobs/unpaid', getProfile, JobController.getUnpaidJobs)

/**
 * Authenticated user pays contractor and updates contractor's balance
 */
app.post('/jobs/:job_id/pay', getProfile, JobController.payContractor)

/**
 * Deposits money into the the the balance of a client
 */
app.post('/balances/deposit/:userId', getProfile, BalanceController.depositFunds)


/**
 * get the highest earning profession during a time range
 * @returns highest paying profession and amount earned 
 */
app.get('/admin/best-profession', getProfile, AdminController.getHighestEarningrofession)

/**
 * get the highest paying clients - limit
 */
app.get('/admin/best-clients', getProfile, AdminController.getHighestPayingClient)

module.exports = app;
