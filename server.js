const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const bookRoutes = require("./routes/bookRoutes"); // 👈 IMPORTANTE: Asegurate de que el archivo está bien importado

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes); // 👈 Asegurate de que esta línea existe

// Ruta de prueba para ver si el servidor está corriendo
app.get("/", (req, res) => {
    res.send("✅ API en funcionamiento!");
});

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error conectando a MongoDB:", err));

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});