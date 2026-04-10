require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const express = require("express");
const app = express();

const User = require("./models/User");
const Student = require("./models/Student");

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
   .then(() => console.log("MongoDB Connected."))
   .catch(err => console.error(err));

app.get("/", (req, res) => {
   res.send("Backend Working");
});

// --- AUTH MIDDLEWARE ---
function auth(req, res, next) {
   const token = req.headers.authorization;
   if (!token) return res.status(401).json({ message: "No token provided." });
   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      req.user = decoded;
      next();
   } catch (err) {
      return res.status(401).json({ message: "Invalid token." });
   }
}

// --- ROLE-BASED ACCESS CONTROL MIDDLEWARE ---
function adminOnly(req, res, next) {
   if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
   }
   next();
}

// --- SIGNUP ---
app.post("/signup", async (req, res) => {
   try {
      const existing = await User.findOne({ email: req.body.email });
      if (existing) return res.status(400).json({ message: "Email already registered." });

      const hashed = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
         name: req.body.name,
         email: req.body.email,
         password: hashed,
         role: req.body.role || "student"
      });
      res.json({ message: "Account created successfully." });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

// --- LOGIN ---
app.post("/login", async (req, res) => {
   try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(400).json({ message: "User not found." });

      const ok = await bcrypt.compare(req.body.password, user.password);
      if (!ok) return res.status(400).json({ message: "Invalid password." });

      const token = jwt.sign(
         { id: user._id, role: user.role },
         process.env.JWT_SECRET || "secret",
         { expiresIn: "7d" }
      );

      res.json({ token, role: user.role });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

// --- STUDENTS CRUD (admin only for write operations) ---
app.post("/students", auth, adminOnly, async (req, res) => {
   try {
      const student = await Student.create(req.body);
      res.json(student);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

app.get("/students", auth, async (req, res) => {
   try {
      const students = await Student.find();
      res.json(students);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

app.put("/students/:id", auth, adminOnly, async (req, res) => {
   try {
      const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(student);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

app.delete("/students/:id", auth, adminOnly, async (req, res) => {
   try {
      await Student.findByIdAndDelete(req.params.id);
      res.json({ message: "Student deleted." });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

app.listen(3000, () => {
   console.log("Server running on port 3000");
});
