const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const roleArray = [...roles]
        console.log(roleArray)
        console.log(req.employee)
        if (!roles.includes(req.employee.role)) {
            return res.status(401).send({ success: false, message: 'non autorisé' });
        }
        next()
    }
}
module.exports = { authorizeRoles }