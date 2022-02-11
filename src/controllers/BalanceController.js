const { Op } = require("sequelize");

/**
 * Deposits money into the the the balance of a client
 */
async function depositFunds(req, res) {
    const sequelize = await req.app.get('sequelize');
    const transaction = await sequelize.transaction();
    try {
        const { Contract, Job, Profile } = req.app.get('models')

        const { userId } = req.params
        //  get all active contracts associated with the requesting user
        const contracts = await Contract.findAll({
            attributes: ['id'],
            where: {
                status: {
                    [Op.or]: [
                        'new', 'in_progress'
                    ]
                },
                [Op.or]: [
                    { ClientId: userId },

                ]
            }
        })
        // check if the requesting user has any active contract
        if (!contracts || contracts.length == 0) {
            return res.status(403).json({
                message: 'Could not complete request. This profile has no active contracts',
            }).end()
        }

        // return all active contract ids
        const contractsID = contracts.map((contract) => contract.id)

        // get the sum price of all unpaid jobs
        const sumJobsPrice = await Job.sum('price', {
            where: {
                paid: false,
                ContractId: {
                    [Op.in]: contractsID
                }
            }
        });
        // check if the price sum was collated
        if (!sumJobsPrice || sumJobsPrice == null) {
            return res.status(403).json({
                message: 'Could not complete request. This profile can not be funded at the moment. You have no active jobs',
            }).end()
        }

        // get the 25% of the total unpaid jobs
        let quarterSumJobPrice = (sumJobsPrice / 4)

        // return error response if the deposit amount is above the limit
        if (req.body.amount && req.body.amount > quarterSumJobPrice) {
            return res.status(400).json({
                message: 'Maximum Deposit Amount Exceeded',
            }).end()
        }
        // use the amount supplied by the user
        if (req.body.amount && req.body.amount < quarterSumJobPrice) {
            quarterSumJobPrice = req.body.amount
        }

        // else deposit the calculated amount
        // deposit funds into clients account
        await Profile.increment({
            balance: quarterSumJobPrice
        }, {
            where: {
                id: userId
            }
        }, { transaction })

        await transaction.commit();

        // return the updated profile
        const profile = await Profile.findByPk(userId)

        res.status(200).json({
            message: 'successfully deposited into user account. User balance updated',
            amount_funded: quarterSumJobPrice,
            profile
        })


    } catch (error) {
        console.error(error)
        await transaction.rollback();
        return res.status(500).json({
            message: 'System encountered an error',
            error
        })
    }
}
module.exports = {
    depositFunds
}