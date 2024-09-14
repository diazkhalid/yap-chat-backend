const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: "Name is Required",
    },
    email: {
      type: String,
      required: "Email is Required",
    },
    password: {
      type: String,
      required: "Password is Required",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
