const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');

const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());

app.get("/", (req, res) => {
    return res.json("Ok")
})


connectDB();
app.listen(PORT, () => {
    console.log("You are listening on port " + PORT);
})
