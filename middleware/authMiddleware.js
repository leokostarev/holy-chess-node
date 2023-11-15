const {Logger} = require("../src/logging");
const JWT = require("jsonwebtoken");
const {raise} = require("../src/utils");

const logger = new Logger("AuthMiddleware");

module.exports = exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(403).json({error: "User is not authorized"});
        }

        req.user = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET || raise("ACCESS_TOKEN_SECRET IS NOT SPECIFIED"));

        return next();
    } catch (e) {
        logger.warning("err in auth AuthMiddleware " + e);

        return res.status(403).json({error: "User is not authorized"});
    }
};