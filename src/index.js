const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const unless = require('express-unless');
const boardRoute = require('./routes/boardRoute');

const PORT = process.env.PORT || 4500;


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());

app.get("/", (req, res) => {
    return res.json("Ok")
})


connectDB().catch(err => {
    console.log(err);
})

app.use('/board', boardRoute);
app.listen(PORT, () => {
    console.log("You are listening on port " + PORT);
})
