const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Chatroom is Required",
    ref: "ChatRoom",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: "User is Required",
    ref: "User",
  },
  message: {
    type: String,
    required: "Message is Required",
  },
});

module.exports = mongoose.model("Messages", messageSchema);
