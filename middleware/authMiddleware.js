const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware para verificar JWT
const protect = async (req, res, next) => {
    let token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ msg: "Acceso denegado, no hay token" });
    }
    try {
        token = token.replace("Bearer ", ""); // Remover "Bearer "
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401).json({ msg: "Token no válido" });
    }
};

// Middleware para verificar si el usuario es admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Acceso denegado, se requiere rol de administrador" });
    }
    next();
};

module.exports = { protect, isAdmin };