// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Obtener todos los libros
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;

        console.log(`🔹 Página solicitada: ${page}, Límite: ${limit}`);

        const books = await Book.find().skip(skip).limit(limit).lean(); // 👈 IMPORTANTE: Convierte los documentos a objetos JS puros

        const totalBooks = await Book.countDocuments();

        console.log("🔹 Libros enviados al frontend:", books);

        res.json({
            books: books.map(book => ({ ...book, _id: book._id.toString() })), // 👈 Convertimos _id a string
            totalPages: Math.ceil(totalBooks / limit),
            currentPage: page
        });
    } catch (error) {
        console.error("❌ Error al obtener los libros:", error);
        res.status(500).json({ msg: "Error al obtener los libros", books: [] });
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

// Eliminar un libro (solo admin)
router.delete("/:id", protect, isAdmin, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ msg: "Libro no encontrado" });

        await book.deleteOne();
        res.json({ msg: "Libro eliminado" });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar el libro" });
    }
});

// Editar un libro (solo admin)
router.put("/:id", protect, isAdmin, async (req, res) => {
    try {
        const { title, author, genre } = req.body;
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ msg: "Libro no encontrado" });

        book.title = title || book.title;
        book.author = author || book.author;
        book.genre = genre || book.genre;

        await book.save();
        res.json(book);
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar el libro" });
    }
});

module.exports = router;