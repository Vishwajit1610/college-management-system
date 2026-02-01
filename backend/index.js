require("dotenv").config();
const mongoose = require("mongoose");

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

app.post("/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.json(student);
    }
    catch (err){
        res.status(500).json({error: err.message}); 
    }
})

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
}   catch(err) {
        res.status(500).json({error: err.message});
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});