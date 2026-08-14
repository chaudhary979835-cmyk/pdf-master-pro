const connectDB = require("./config/database");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

connectDB();

const app = express();

// Routes
const pdfRoutes = require("./routes/pdfRoutes");
const splitRoutes = require("./routes/splitRoutes");
const compressRoutes = require("./routes/compressRoutes");
const authRoutes = require("./routes/authRoutes");
const historyRoutes = require("./routes/historyRoutes");
const imageToPDFRoutes = require("./routes/imageToPDFRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Static folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/output", express.static(path.join(__dirname, "output")));

// API Routes
app.use("/api/pdf", pdfRoutes);
app.use("/api/pdf", splitRoutes);
app.use("/api/pdf", compressRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use( "/api/pdf",imageToPDFRoutes);


// Home Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 PDF Master Pro Backend Running Successfully"
    });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

