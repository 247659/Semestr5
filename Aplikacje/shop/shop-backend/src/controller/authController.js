const {StatusCodes} = require("http-status-codes");
const knex = require('knex')(require('../../knexfile').development);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !['KLIENT', 'PRACOWNIK'].includes(role)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Nieprawidłowe dane.' });
    }

    let userCheck = await knex('users')
        .where({ username }).first();

    if (userCheck === undefined) {
        userCheck = 0
    }

    if (userCheck !== 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: `Nazwa użytkownika zajęta.` });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await knex('users').insert({ username, password: hashedPassword, role });
        res.status(StatusCodes.CREATED).json({ message: 'Użytkownik zarejestrowany. Zaloguj się' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera.' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await knex('users').where({ username }).first();
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Nieprawidłowe dane logowania.' });
        }

        const accessToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: 300 });
        const refreshToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.TOKEN_REFRESH_SECRET, { expiresIn: 3600 });

        res.cookie('accessToken', accessToken, {
            maxAge: 300000,
            httpOnly: true,
        }).cookie('refreshToken', refreshToken, {
            maxAge: 3600000,
            httpOnly: true,
        })
        res.status(StatusCodes.OK).json({ message: 'Zalogowano', role: user.role, username: user.username, expiresIn: 300 });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera.' });
    }
};

const logout = async (req, res) => {
    res.clearCookie('accessToken').clearCookie('refreshToken');
    res.status(StatusCodes.OK).json({ message: 'Logout successfully!' });
}

const refresh = async (req, res) => {
    const refToken = req.cookies.refreshToken;

    if (!refToken) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Brak tokenu.' });

    try {
        const decoded = jwt.verify(refToken, process.env.TOKEN_REFRESH_SECRET);

        const { id, username, role } = decoded;
        const accessToken = jwt.sign({ id: id, username: username, role: role }, process.env.TOKEN_SECRET, { expiresIn: 300 });
        res.cookie('accessToken', accessToken, {
            maxAge: 300000,
            httpOnly: true,
        })
        res.status(StatusCodes.OK).json({ message: 'Token odświeżony', expiresIn: 300 });
    } catch (err) {
        return res.sendStatus(StatusCodes.FORBIDDEN);
    }



};

module.exports = {register, login, refresh, logout};