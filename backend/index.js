require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// ✅ MongoDB Connection
mongoose.connect('mongodb://localhost:27017/newdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Connected to MongoDB successfully"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ MongoDB User Model
const User = mongoose.model("User", new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

const app = express();

// ✅ Proper CORS Configuration
app.use(cors({
  origin: "http://localhost:3000",  
  credentials: true,                 
  methods: ["GET", "POST", "PUT", "DELETE"],  
  allowedHeaders: ["Content-Type", "Authorization"]  
}));

app.use(express.json());

const PORT = process.env.PORT || 5001;

// ✅ Check if backend is running
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// ✅ Register Route (Save Users to MongoDB)
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  console.log("🔹 Register Request Received:", req.body);  

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required!" });
  }

  // ✅ Check if user already exists in MongoDB
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists!" });
  }

  // ✅ Save user in MongoDB
  const newUser = new User({ email, password });
  await newUser.save();

  return res.status(200).json({
    message: "✅ Registration successful!",
    user: { email }
  });
});

// ✅ Login Route (Check Users in MongoDB)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("🔹 Login Request Received:", req.body);  

  if (!email || !password) {
    console.log("❌ Error: Email or password missing!");
    return res.status(400).json({ error: "Email and password are required!" });
  }

  // ✅ Check if user exists and password matches in MongoDB
  const user = await User.findOne({ email, password });
  if (!user) {
    console.log("❌ Invalid credentials!");
    return res.status(401).json({ error: "Invalid credentials" });
  }

  console.log("✅ Login successful!");
  return res.status(200).json({ message: "✅ Login successful!", token: "dummy-jwt-token" });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log('✅ Server is running on port ${PORT}');
});