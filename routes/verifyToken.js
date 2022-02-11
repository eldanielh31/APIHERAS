const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json("Token no válido");
            req.user = user;
            next();
        })  
    } else {
        return res.status(401).json("No está autenticado")
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("No está autorizado para hacer eso")
        }
    })
};

const verifyTokenAndAdmi = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("No está autorizado para hacer eso")
        }
    })
};
module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmi };