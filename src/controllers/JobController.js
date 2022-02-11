const { Op } = require("sequelize");

/**
 * Fetch unpaid active contract jobs for an authenticated profile
 * @returns jobs 
 */
async function getUnpaidJobs(req, res) {
    try {
        const { Contract, Job } = req.app.get('models')

        const contracts = await Contract.findAll({
            attributes: ['id'],
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

        if (!contracts || contracts.length == 0) return res.status(404).json({
            message: 'Could not find unpaid jobs. This profile has no active contracts',
        }).end()

        // return all active contract ids
        const contractsID = contracts.map((contract) => contract.id)
        // get all unpaid jobs using the user's contracts
        const jobs = await Job.findAll({
            where: {
                paid: false,
                ContractId: {
                    [Op.in]: contractsID
                }
            }
        })

        if (!jobs || jobs.length == 0) return res.status(404).json({
            message: 'Could not find unpaid jobs. This profile has no unpaid jobs',
        }).end()

        return res.status(200).json({
            message: 'successfully returned all unpaid jobs with active contracts for this profile',
            result: jobs
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'System encountered an error',
            error
        })
    }
}
/**
 * Authenticated user pays contractor and updates contractor's balance
 */
async function payContractor(req, res) {
    const sequelize = await req.app.get('sequelize');
    const transaction = await sequelize.transaction();
    try {
        const { Job, Contract, Profile } = req.app.get('models')
        const { job_id } = req.params
        const job = await Job.findOne({
            where: {
                id: job_id
            },
            include: Contract
        })

        // check if the requested job exists
        if (!job || job == null) {
            return res.status(404).json({
                message: 'Could not find the requested job'
            }).end()
        }
        const contract = job.Contract

        // check if there is a relating contract
        if (!contract) {
            return res.status(404).json({
                message: 'Could not find the requested job'
            }).end()
        }

        // check if the job and contract belongs to the auth user(client)
        if (contract.ClientId != req.profile.id) {
            return res.status(403).json({
                message: 'This job does not belong to the authenticated profile(you)'
            }).end()
        }
        // check if the job has already been paid for
        if (job.paid == true) {
            return res.status(403).json({
                message: 'The contractor has already been paid for this job'
            }).end()
        }

        //check  balance - if the client has enough money to pay
        if (req.profile.balance < job.price) {
            return res.status(403).json({
                message: 'You does not have the balance to pay the contractor'
            }).end()
        }
        // update the client and contractor accounts
        await Profile.increment({ balance: -job.price }, { where: { id: contract.ClientId } }, { transaction })
        await Profile.increment({ balance: job.price }, { where: { id: contract.ContractorId } }, { transaction })

        // update job to reflect that the contractor has been paid
        await job.update({
            paid: true
        }, { transaction })

        //commit transaction
        await transaction.commit();
        return res.status(200).json({
            message: 'Successfully paid contractor for this job',
            result: job
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
    getUnpaidJobs,
    payContractor
}