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
});
