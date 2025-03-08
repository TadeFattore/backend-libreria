const jwt = require("jsonwebtoken");

// Middleware para verificar JWT
const protect = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ msg: "Acceso denegado, no hay token" });
    
    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
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