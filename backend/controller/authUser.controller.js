const { UserModel } = require("../model/user");
const { BlackListModel } = require("../model/BlackList");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// Register New User
const RegisterdUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Check if username already exists
    const registerUserName = await UserModel.findOne({ username });
    if (registerUserName) {
      return res
        .status(400)
        .send({ msg: "Username already exists! Try with a different username." });
    }

    // Check if email already exists
    const registerUserEmail = await UserModel.findOne({ email });
    if (registerUserEmail) {
      return res
        .status(409)
        .send({ msg: "Email already exists! Try with a different email." });
    }

    // Hash password
    bcrypt.hash(password, 5, async function (err, hash) {
      if (err) {
        return res.status(404).json({ err: err });
      } else {
        // Create new user with hashed password
        const registerUser = new UserModel({ ...req.body, password: hash });
        await registerUser.save();

        return res.status(200).json({
          msg: "New user is registered now!",
          registerUser: { ...registerUser._doc, password: undefined }, // Exclude password
        });
      }
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Login User
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const existinguser = await UserModel.findOne({ email });
    if (!existinguser) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare password with hashed password in DB
    bcrypt.compare(password, existinguser.password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error comparing passwords" });
      }

      // If password matches
      if (result) {
        // Generate JWT Token
        const token = jwt.sign(
          { userId: existinguser._id },
          process.env.secretkey,
          { expiresIn: "1h" } // Optional: Set expiration time for token
        );

        // Return success response with token and user data
        return res.status(200).json({
          msg: "Login Success!",
          token: token,
          existinguser: { ...existinguser._doc, password: undefined }, // Exclude password
        });
      } else {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Logout User
const logOut = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  if (token) {
    try {
      // Add token to blacklist
      const data = new BlackListModel({ token: token });
      await data.save();

      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error logging out" });
    }
  } else {
    return res.status(400).json({ message: "Logout failed. Token not found." });
  }
};

// Get User Data (Example, can be expanded later)
const GetSingleUserDATA = (req, res, next) => {
  // Logic for fetching single user data, if required
};

module.exports = {
  RegisterdUser,
  loginUser,
  logOut,
  GetSingleUserDATA, // Include if necessary later
};
