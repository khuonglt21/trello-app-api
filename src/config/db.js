const mongoose = require('mongoose');


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully!")

    } catch (err) {
        console.log("Connect DB failed!");
        process.exit(1);
    }
}

module.exports = connectDB;