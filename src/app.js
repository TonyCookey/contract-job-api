const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model')
const { Op } = require("sequelize");
const { getProfile } = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.get('/', async (req, res) => {
    res.status(200).json({
        message: "Wlcome to API"
    })
})

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {
    // return res.json(req.profile)
    const { Contract } = req.app.get('models')
    const { id } = req.params
    console.log();
    const contract = await Contract.findOne({
        where: {
            id,
            [Op.or]: [
                { ClientId: req.profile.id },
                { ContractorId: req.profile.id }
            ]
        }
    })
    console.log(contract);
    if (!contract) return res.status(404).json({
        message: 'Could not find requested contract'
    }).end()
    return res.status(200).json(contract)
})
module.exports = app;
