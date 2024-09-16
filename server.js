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

app.listen(4000, () => console.log("Server started on http://localhost:4000"));
