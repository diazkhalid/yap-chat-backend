const mongoose = require("mongoose");
const Messages = mongoose.model("Messages");
const getMessageByChatRoomId = async (req, res) => {
  const { chatRoomId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(chatRoomId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid chat room ID",
    });
  }

  const objectId = new mongoose.Types.ObjectId(chatRoomId);
  console.log(objectId);

  try {
    const messages = await Messages.aggregate([
      {
        $match: {
          chatroom: objectId,
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

    return res.status(200).json({
      status: 200,
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while fetching messages",
    });
  }
};

module.exports = { getMessageByChatRoomId };
