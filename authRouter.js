const Router = require("express");
const {check} = require("express-validator");
const controller = require("./authController");
const roleMiddleware = require("./middleware/roleMiddleware");

const router = new Router();


router.post("/signup", [
    check("username", "username can not be empty!").notEmpty(),
    check("password", "password must be 4 characters at least!").isLength({min: 4}),
], controller.signup);
router.post("/login", controller.login);
router.get("/users", roleMiddleware(["ADMIN"]), controller.getUsers);


module.exports = exports = router;
