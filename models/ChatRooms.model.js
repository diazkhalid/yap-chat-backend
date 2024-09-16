const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is Required",
  },
  room_master_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = mongoose.model("ChatRooms", chatRoomSchema);
