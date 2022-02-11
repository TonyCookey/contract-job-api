const e = require("express");
const { Op } = require("sequelize");

/**
 * get the highest earning profession during a time range
 */
async function getHighestPaidrofession(req, res) {

    try {
        const sequelize = await req.app.get('sequelize');
        const { Profile } = req.app.get('models')
        const { start, end } = req.query
        // validate query params

        if (!req.params || !start || !end) {
            return res.status(400).json({
                message: 'Could not complete request. date range is required - (start - end)',
            }).end()
        }

        if (!validateDate(start, end)) {
            return res.status(400).json({
                message: 'Could not complete request. please use the valid date format(YY/MM/DD)',
            }).end()
        }

        // get highest paid profession by collating, grouping paid jobs
        const [results] = await sequelize.query(`
        SELECT  Contracts.createdAt ,Contracts.ContractorId , SUM(Jobs.price) as amountEarned
        FROM Jobs
        INNER JOIN Contracts ON Jobs.ContractId=Contracts.id
        WHERE Contracts.createdAt >= '${start}' AND Contracts.createdAt < '${end}' AND Jobs.paid = true
        GROUP BY ContractorId
        ORDER BY amountEarned DESC;
        LIMIT 1;
        `);

        if (!results || results.length == 0) {
            return res.status(404).json({
                message: 'Could not find the highest paid profession within this date range',
            }).end()
        }

        const profile = await Profile.findByPk(results[0].ContractorId)

        return res.status(200).json({
            message: `Successfully returned the highest paid Profession based on paid jobs from '${start}' - '${end}'`,
            profession: profile.profession,
            amountEarned: results[0].amountEarned,

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
 * get the highest paying client during a time range
 */
async function getHighestPayingClient(req, res) {
    try {
        const sequelize = await req.app.get('sequelize');
        const { Profile } = req.app.get('models')
        const { start, end, limit } = req.query

        // validate query params
        if (!req.params || !start || !end) {
            return res.status(400).json({
                message: 'Could not complete request. date range is required - (start - end)',
            }).end()
        }

        if (!validateDate(start, end)) {
            return res.status(400).json({
                message: 'Could not complete request. please use the valid date format(YY/MM/DD)',
            }).end()
        }
        // get highest paying client by collating, grouping paid jobs
        const [clients] = await sequelize.query(`
            SELECT  Contracts.createdAt ,Contracts.ClientId , SUM(Jobs.price) as amountPaid
            FROM Jobs
            INNER JOIN Contracts ON Jobs.ContractId=Contracts.id
            WHERE Contracts.createdAt >= '${start}' AND Contracts.createdAt < '${end}' AND Jobs.paid = true
            GROUP BY ClientId
            ORDER BY amountPaid DESC
            LIMIT ${limit || 2};
            `);


        if (!clients || clients.length == 0) {
            return res.status(404).json({
                message: 'Could not find the highest paying client within this date range',
            }).end()
        }

        const highestPayingClients = await Promise.all(clients.map(async (client) => {
            const profile = await Profile.findByPk(client.ClientId)
            return {
                id: profile.id,
                fullName: profile.getFullname(),
                paid: client.amountPaid
            }
        }))

        return res.status(200).json({
            message: `Successfully returned the highest paying client based on paid jobs from '${start}' - '${end}'`,
            result: highestPayingClients
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'System encountered an error',
            error
        })
    }
}

// Date Validator Helper Function
function validateDate(start, end) {
    start = new Date(start)
    end = new Date(end)
    if (isNaN(Date.parse(start)) || isNaN(Date.parse(end))) {
        return false
    };
    return true

}

module.exports = {
    getHighestPaidrofession,
    getHighestPayingClient
}