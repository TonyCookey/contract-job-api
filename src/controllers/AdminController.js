const e = require("express");
const { Op } = require("sequelize");

/**
 * get the highest earning profession during a time range
 */
async function getHighestEarningrofession(req, res) {

    try {
        const { Contract, Job, Profile } = req.app.get('models')
        const { start, end } = req.query

        if (!req.params || !start || !end) {
            return res.status(400).json({
                message: 'Could not complete request. date range is required - (start - end)',
            }).end()
        }


        // get highest paying profession by collating, grouping paid jobs
        const [results, metadata] = await sequelize.query(`
        SELECT Jobs.ContractId, Contracts.createdAt ,Contracts.ContractorId , SUM(Jobs.price) as amountEarned
        FROM Jobs
        INNER JOIN Contracts ON Jobs.ContractId=Contracts.id
        WHERE Contracts.createdAt >= '${start}' AND Contracts.createdAt < '${end}' AND Jobs.paid = true
        GROUP BY ContractId
        ORDER BY amountEarned DESC
        LIMIT 1;
        `);

        if (!results || results.length == 0) {
            return res.status(404).json({
                message: 'Could not find the highest profession within this date range. Try a wider date range',
            }).end()
        }

        const profile = await Profile.findByPk(results[0].ContractorId)

        return res.status(200).json({
            message: `Successfully returned the highest paying profession based on paid jobs from ${start} - ${end}`,
            profession: profile.profession,
            amountEarned: results[0].amountEarned
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
async function getHighestPayingClient(req, res) { }

module.exports = {
    getHighestEarningrofession,
    getHighestPayingClient
}