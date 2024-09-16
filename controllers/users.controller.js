const {
  RegisterValidSchema,
  LoginValidSchema,
} = require("../validators/users.validator");
const mongoose = require("mongoose");
const User = mongoose.model("Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const verifyUsernameOrEmailAvailability = async (username, email) => {
  const user = await User.findOne({ username });
  const userEmail = await User.findOne({ email });
  return user || userEmail ? false : true;
};

const register = async (req, res) => {
  const validateReqBody = RegisterValidSchema.safeParse(req.body);
  if (!validateReqBody.success) {
    const { errors } = validateReqBody.error;

    return res.status(400).json({
      status: 400,
      message: "Bad Request",
      errors,
    }); // Corrected response format
  }
  const { username, email, password } = req.body;
  const verifyAvailability = await verifyUsernameOrEmailAvailability(
    username,
    email
  );
  if (!verifyAvailability) {
    return res.status(400).json({
      status: 400,
      message: "User or Email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ username, email, password: hashedPassword });
  const savedUser = await user.save();
  return res.status(201).json({
    status: 201,
    message: "User created successfully",
    data: savedUser,
  });
};

const login = async (req, res) => {
  const validateReqBody = LoginValidSchema.safeParse(req.body);
  if (!validateReqBody.success) {
    const { errors } = validateReqBody.error;

    return res.status(400).json({
      status: 400,
      message: "Bad Request",
      errors,
    });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: "User is not registered",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      status: 401,
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: `${process.env.JWT_EXPIRES_IN}h`,
    }
  );

  return res.status(201).json({
    status: 201,
    message: "User logged in successfully",
    token,
  });
};

const getSession = async (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "User session retrieved successfully",
    data: req.payload,
  });
};

module.exports = { register, login, getSession };
