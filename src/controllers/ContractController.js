const { Op } = require("sequelize");

/**
 * Fetch Contract for the Authenticated Profile
 * @returns contract by id
 */
async function getContractForAuthProfile(req, res) {
    try {
        const { Contract } = req.app.get('models')

        const { id } = req.params
        // find a single contract using the contract identifier
        const contract = await Contract.findOne({
            where: {
                id,
                [Op.or]: [
                    { ClientId: req.profile.id },
                    { ContractorId: req.profile.id }
                ]
            }
        })
        // return error if contract is not found
        if (!contract) return res.status(404).json({
            message: 'Could not find requested contract'
        }).end()
        return res.status(200).json(contract)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'System encountered an error',
            error
        })
    }
}

/**
 * Fetch Non Terminated Contracts for the Authenticated Profile
 * @returns contract by id
 */
async function getNonTerminatedContractForAuthProfile(req, res) {
    try {
        const { Contract } = req.app.get('models')

        // find all unterminated contracts for the authenticated profile
        // either as a contractor or client
        const contracts = await Contract.findAll({
            where: {
                status: {
                    [Op.or]: [
                        'new', 'in_progress'
                    ]
                },
                [Op.or]: [
                    { ClientId: req.profile.id },
                    { ContractorId: req.profile.id }
                ]
            }
        })
        //  check if contracts exists
        if (!contracts || contracts.length == 0) return res.status(404).json({
            message: 'Could not find non terminated contracts - new or in_progress contracts',
        }).end()

        return res.status(200).json({
            message: 'successfully returned all unterminated contracts for this profile',
            result: contracts
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'System encountered an error',
            error
        })
    }
}
module.exports = {
    getContractForAuthProfile,
    getNonTerminatedContractForAuthProfile
}