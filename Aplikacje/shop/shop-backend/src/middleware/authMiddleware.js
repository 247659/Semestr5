const { StatusCodes } = require('http-status-codes');
const jwt = require("jsonwebtoken");
require('dotenv').config({ path: '../../.env' });

const authenticateToken = (req, res, next) => {
    // const authHeader = req.headers.authorization;
    // if (!authHeader) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Brak tokenu autoryzacji.' });
    //
    // const token = authHeader.split(' ')[1];

    const token = req.cookies.accessToken
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(StatusCodes.FORBIDDEN).json({ message: 'Nieprawidłowy token.' });

        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };