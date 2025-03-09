const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ruta de prueba para comprobar si el backend está funcionando
app.get("/", (req, res) => {
    res.send("✅ API en Railway funcionando!");
});

// Conectar a MongoDB sin opciones obsoletas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error conectando a MongoDB:", err));

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
