require("dotenv").config();
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const express = require("express");
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected."))
.catch(err => console.error(err));


app.get("/", (req, res) => {
    res.send("Backend Working");
});

const Student = require("./models/Student");
const { EmitFlags } = require("typescript");

app.post("/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.json(student);
    }
    catch (err){
        res.status(500).json({error: err.message}); 
    }
})

app.get("/students", auth, async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.post("/signup", async (req, res) => {
    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashed
    });

    res.json(user);
});

app.post("/login", async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send("User not found!");

    const ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok) return res.status(400).send("Invalid Password!");

    const token = jwt.sign(
        {id: user._id, role: user.role},
        "secret"
    );

    res.json({token});
});

function auth(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send("No Token.");

    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    next();
}

app.listen(3000, () => {
    console.log("Server running on port 3000");
});