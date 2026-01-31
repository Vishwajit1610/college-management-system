const express = require("express");
const app = express();

app.use(express.json());

let students = [];

app.get("/", (req, res) => {
    res.send("Backend Working");
});

app.post("/students", (req, res) => {
    students.push(req.body);
    res.json(students);
});

app.get("/students", (req, res) => {
    res.json(students);
});

app.listen(3000, () => {
    console.log("Server running on port 3000.");
});
