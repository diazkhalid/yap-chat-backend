const express = require("express");
const app = express();
var cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const usersRoute = require("./routes/users.route");
const chatRoomsRoute = require("./routes/chatrooms.route");
app.get("/", (req, res) => res.send("WELCOME!"));
app.use("/users", usersRoute);
app.use("/chatrooms", chatRoomsRoute);

const errorHandler = require("./handlers/error.handler");
app.use(errorHandler.notFound);
app.use(errorHandler.mongooseErrors);

if (process.env.ENV === "DEVELOPMENT") {
  app.use(errorHandler.developmentErrors);
} else {
  app.use(errorHandler.productionErrors);
}

module.exports = app;
