const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registrar un nuevo usuario (solo usuarios comunes)
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "El usuario ya existe" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, role: "user" });

        await user.save();

        res.status(201).json({ msg: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ msg: "Error en el registro" });
    }
});

module.exports = router;