const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Book = require("../models/Book");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {protect, isAdmin} = require("../middleware/authMiddleware");

// Registro de usuario
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "Usuario ya existe" });

        user = new User({ name, email, password, role });
        await user.save();
        res.status(201).json({ msg: "Usuario registrado" });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
});

// Login de usuario
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Credenciales inválidas" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Credenciales inválidas" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
});

router.get("/me", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener el usuario" });
    }
});

router.get("/reservations", protect, async (req, res) => {
    try {
        const reservedBooks = await Book.find({ available: false });
        res.json(reservedBooks);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener las reservas" });
    }
});

// Obtener todos los usuarios (solo admin)
router.get("/", protect, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los usuarios" });
    }
});

// Crear un nuevo usuario (solo admin)
router.post("/", protect, isAdmin, async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "El usuario ya existe" });

        user = new User({ name, email, password, role });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ msg: "Error al registrar el usuario" });
    }
});

// Eliminar un usuario (solo admin)
router.delete("/:id", protect, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

        await user.deleteOne();
        res.json({ msg: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar el usuario" });
    }
});

module.exports = router;
