
const getProfile = async (req, res, next) => {
    const { Profile } = req.app.get('models')
    console.log(req.get('profile_id'));

    const profile = await Profile.findOne({ where: { id: req.get('profile_id') || null } })

    if (!profile) return res.status(401).json({
        message: 'User Authentication Failed'
    }).end()
    req.profile = profile
    next()
}
module.exports = { getProfile }