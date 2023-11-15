const Logging = require("./src/logging");
const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DotEnv = require("dotenv");

const {validationResult} = require("express-validator");
const User = require("./models/User");
const Role = require("./models/Role");
const {raise} = require("./src/utils");

const logger = new Logging.Logger("AuthController");

DotEnv.config();
const generateAccessToken = (id, roles) => {
    return jwt.sign(
        {id, roles},
        process.env.ACCESS_TOKEN_SECRET || raise("ACCESS_TOKEN_SECRET IS NOT SPECIFIED"),
        {
            expiresIn: "10d",
        });
};

class AuthController {
    async signup(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }

            const {username, password} = req.body;

            const candidate = await User.findOne({username});

            if (candidate) {
                return res.status(400).json({error: "username taken"});
            }

            const userRole = await Role.findOne({value: "USER"});

            const user = new User({
                username, password: Bcrypt.hashSync(password, 10), roles: [userRole.value],
            });

            await user.save();

            return res.status(200).json({message: "user created"});

        } catch (e) {
            logger.warning("err in signup " + e);
            res.status(400).json({error: e});
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;

            const user = await User.findOne({username});

            if (!user) {
                res.status(400).json({error: "user not found"});
            }

            const isMatch = await Bcrypt.compareSync(password, user.password);

            if (!isMatch) {
                res.status(400).json({error: "invalid password"});
            }

            const token = generateAccessToken(user._id, user.roles);
            return res.status(200).json({token});

        } catch (e) {
            logger.warning("err in login " + e);
            res.status(400).json({error: e});
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();


            res.json(users);
        } catch (e) {
            logger.warning("err in getUsers " + e);
            res.status(400).json({error: e});
        }
    }
}


module.exports = exports = new AuthController();