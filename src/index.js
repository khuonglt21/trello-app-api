const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const {unless} = require('express-unless');
const boardRouter = require('./routes/boardRoute');
const listRouter = require('./routes/listRoute');
const userRoute = require('./routes/userRoute');
const auth = require("./middlewares/auth");
const boardsRouter = require('./routes/boardsRoute');

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
        ],
    })
);

// Routes
app.use("/api/board", boardRouter);
app.use("/api/list", listRouter);
app.use('/api/user', userRoute);
app.use('/api/boards', boardsRouter);

connectDB();
app.listen(PORT, () => {
    console.log("You are listening on port " + PORT);
})
