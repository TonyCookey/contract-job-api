const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const app = express();
const ContractController = require('./controllers/ContractController')
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
 * @returns contract by id
 */
app.get('/contracts', getProfile, ContractController.getNonTerminatedContractForAuthProfile)

module.exports = app;
