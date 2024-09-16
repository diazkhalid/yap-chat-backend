const router = require("express").Router();
const { catchErrors } = require("../handlers/error.handler");
const userController = require("../controllers/users.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");

router.post("/register", catchErrors(userController.register));
router.post("/login", catchErrors(userController.login));
router.get("/session", AuthMiddleware, catchErrors(userController.getSession));

module.exports = router;
