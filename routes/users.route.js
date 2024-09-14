const router = require("express").Router();
const { catchErrors } = require("../handlers/error.handler");
const userController = require("../controllers/users.controller");

router.post("/register", catchErrors(userController.register));
router.post("/login", catchErrors(userController.login));

module.exports = router;
