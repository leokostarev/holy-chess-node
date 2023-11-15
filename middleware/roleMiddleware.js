const {Logger} = require("../src/logging");
const JWT = require("jsonwebtoken");
const {raise} = require("../src/utils");

const logger = new Logger("RoleMiddleware");

module.exports = exports = roles => (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(403).json({error: "User is not authorized"});
        }

        const {roles: userRoles} = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET || raise("ACCESS_TOKEN_SECRET IS NOT SPECIFIED"));

        let hasRole = false;
        roles.forEach(role => {
            if (userRoles.includes(role)) {
                hasRole = true;
            }
        });
        if (!hasRole) {
            return res.status(403).json({error: "User has no access"});
        }

        return  next();
    } catch (e) {
        logger.warning("err in auth RoleMiddleware " + e);

        return res.status(403).json({error: "User is not authorized"});
    }
};