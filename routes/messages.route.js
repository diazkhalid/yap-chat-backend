const { catchErrors } = require("../handlers/error.handler");
const AuthMiddleware = require("../middlewares/auth.middleware");
const messagesController = require("../controllers/messages.controller");
const router = require("express").Router();

router.get(
  "/:chatRoomId",
  AuthMiddleware,
  catchErrors(messagesController.getMessageByChatRoomId)
);

module.exports = router;
