require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);

mongoose.connection.on("error", (err) => {
  console.log("Mongoose Error: " + err.message);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

require("./models/ChatRooms.model");
require("./models/Users.model");
require("./models/Messages.model");

const app = require("./app");

const server = app.listen(4000, () =>
  console.log("Server started on http://localhost:4000")
);

const io = require("socket.io")(server);
const jwt = require("jsonwebtoken");

const Messages = mongoose.model("Messages");
const Users = mongoose.model("Users");

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    socket.userId = payload.id;
    next();
  } catch (error) {}
});

io.on("connection", (socket) => {
  console.log("User connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.userId);
  });
  socket.on("joinRoom", ({ chatRoomId }) => {
    socket.join(chatRoomId);
    console.log("User joined room: " + chatRoomId);
  });

  socket.on("leaveRoom", ({ chatRoomId }) => {
    socket.leave(chatRoomId);
    console.log("User left room: " + chatRoomId);
  });

  socket.on("chatRoomMessage", async ({ chatRoomId, message }) => {
    if (message.trim().length > 0) {
      const user = await Users.findOne({ _id: socket.userId });
      const newMessage = new Messages({
        chatroom: chatRoomId,
        user: socket.userId,
        message,
      });
      const savedMessage = await newMessage.save();
      const objectId = new mongoose.Types.ObjectId(chatRoomId);
      const addedMessage = await Messages.aggregate([
        {
          $match: {
            chatroom: objectId,
            _id: savedMessage._id,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $addFields: { username: { $arrayElemAt: ["$user.username", 0] } } },
        { $addFields: { userId: { $arrayElemAt: ["$user._id", 0] } } },
        {
          $sort: { createdAt: 1 },
        },
        {
          $project: {
            user: 0,
            __v: 0,
          },
        },
      ]);
      io.to(chatRoomId).emit("newMessage", addedMessage[0]);
    }
  });
});
