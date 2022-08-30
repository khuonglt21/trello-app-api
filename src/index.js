const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const {unless} = require('express-unless');

const boardRouter = require('./routes/boardRoute');
const teamRouter = require('./routes/teamRoute');
const listRouter = require('./routes/listRoute');
const userRoute = require('./routes/userRoute');
const auth = require("./middlewares/auth");
const cardRoute = require("./routes/cardRoute");

const boardsRouter = require('./routes/boardsRoute');
const uploadRouter = require('./routes/uploadRoute');
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());

// AUTH VERIFICATION AND UNLESS

auth.verifyToken.unless = unless;

app.use(
    auth.verifyToken.unless({
        path: [
            {url: '/api/user/login', method: ['POST']},
            {url: '/api/user/register', method: ['POST']},
            {url: /^\/api\/user\/check-email\/.*/, method: ['GET']},
            {url: /^\/avatars\/.*/, method: ['GET']},
            {url: /^\/fileCard\/.*/, method: ['GET']},
        ],
    })
);

app.use("/avatars", express.static("src/public/avatars"))
app.use('/fileCard',express.static("src/public/cards"))
// Routes
app.use("/api/board", boardRouter);
app.use("/api/list", listRouter);
app.use('/api/user', userRoute);
app.use('/api/card', cardRoute);
app.use('/api/boards', boardsRouter);
app.use('/api/team', teamRouter);
app.use('/api/uploads',uploadRouter);

connectDB();
app.listen(PORT, () => {
    console.log("You are listening on port " + PORT);
})
