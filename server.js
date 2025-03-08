require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");  // 📌 Importamos la conexión
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
connectDB();

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));