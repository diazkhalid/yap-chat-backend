const mongoose = require("mongoose");
const ChatRoom = mongoose.model("ChatRooms");

const checkNameAvailability = async (name) => {
  const chatRoom = await ChatRoom.findOne({ name });
  return chatRoom ? false : true;
};

const createChatRoom = async (req, res) => {
  const { name } = req.body;
  const { id } = req.payload;
  const verifyAvailability = await checkNameAvailability(name);
  if (!verifyAvailability) {
    return res.status(400).json({
      status: 400,
      message: "ChatRoom already exists",
    });
  }

  const chatRoom = new ChatRoom({ name, room_master_id: id });
  const savedChatRoom = await chatRoom.save();
  return res.status(201).json({
    status: 201,
    message: "ChatRoom created successfully",
    data: savedChatRoom,
  });
};

const getChatRooms = async (req, res) => {
  const chatRooms = await ChatRoom.find();
  return res.status(200).json({
    status: 200,
    message: "ChatRooms fetched successfully",
    data: chatRooms,
  });
};

module.exports = { createChatRoom, getChatRooms };
