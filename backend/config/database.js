const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("URI:", process.env.MONGODB_URI);

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });

        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error(err);
    }
};

module.exports = connectDB;

