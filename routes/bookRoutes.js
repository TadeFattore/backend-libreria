// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Obtener todos los libros
router.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los libros" });
    }
});

// Agregar un libro (solo admin)
router.post("/", protect, isAdmin, async (req, res) => {
    try {
        const { title, author, genre, available } = req.body;
        const newBook = new Book({ title, author, genre, available });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ msg: "Error al agregar el libro" });
    }
});

// Reservar un libro (marcarlo como no disponible)
router.put("/:id/reserve", protect, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ msg: "Libro no encontrado" });

        book.available = false;
        await book.save();
        res.json({ msg: "Libro reservado" });
    } catch (error) {
        res.status(500).json({ msg: "Error al reservar el libro" });
    }
});

// Cancelar una reserva (marcar el libro como disponible)
router.put("/:id/cancel", protect, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ msg: "Libro no encontrado" });

        book.available = true;
        await book.save();
        res.json({ msg: "Reserva cancelada" });
    } catch (error) {
        res.status(500).json({ msg: "Error al cancelar la reserva" });
    }
});

module.exports = router;