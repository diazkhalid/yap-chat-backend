const router = require("express").Router();
const { catchErrors } = require("../handlers/error.handler");
const chatRoomController = require("../controllers/chatrooms.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/",
  AuthMiddleware,
  catchErrors(chatRoomController.createChatRoom)
);

router.get("/", AuthMiddleware, catchErrors(chatRoomController.getChatRooms));

module.exports = router;
