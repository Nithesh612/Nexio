const express = require("express");
const cors = require("cors");
require("dotenv").config({ quiet: true });
require("./db");
const hubRoutes = require("./routes/hub");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

// Health check & default route
app.get("/", (req, res) => {
    res.json({ message: "Server is running smoothly", status: "OK" });
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy" });
});

// API Routes
app.use("/hub", hubRoutes);
app.use("/books", hubRoutes); // backward compatibility if needed
app.use("/users", userRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err.stack || err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});