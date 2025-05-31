// interview.js
const express = require("express");
const InterviewerQuestion = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controller/interview.controller");

// Ensure authentication middleware works correctly
InterviewerQuestion.use(auth);

// Routes for AI response, start, and end interview
InterviewerQuestion.post("/gpt/:id", controller.AiResponse);
InterviewerQuestion.post("/interview/start", controller.startInterview);
InterviewerQuestion.post("/interview/end/:id", controller.EndInterview);

// module.exports updated correctly
module.exports = InterviewerQuestion;


// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { InterviewerQuestion } = require("./routes/interview");

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/newdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// MongoDB User Model
const User = mongoose.model("User", new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

const app = express();

// CORS Configuration
app.use(cors({
  origin: "http://localhost:3000",  
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]  
}));

app.use(express.json());

const PORT = process.env.PORT || 5001;

// Health Check
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// Interview Routes
app.use("/api", InterviewerQuestion);

// Register Route
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required!" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists!" });
  }
  const newUser = new User({ email, password });
  await newUser.save();
  return res.status(200).json({ message: "✅ Registration successful!", user: { email } });
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required!" });
  }
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  return res.status(200).json({ message: "✅ Login successful!", token: "dummy-jwt-token" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
