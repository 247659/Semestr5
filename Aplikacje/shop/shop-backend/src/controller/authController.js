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

        const accessToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: 86400 });
        const refreshToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.TOKEN_REFRESH_SECRET, { expiresIn: 525600 });

        res.cookie('accessToken', accessToken, {
            maxAge: 86400000,
            httpOnly: true,
        }).cookie('refreshToken', refreshToken, {
            maxAge: 525600000,
            httpOnly: true,
        })
        res.status(StatusCodes.OK).json({ message: 'Zalogowano', role: user.role });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera.' });
    }
};

const refresh = async (req, res) => {
    const { refToken } = req.body;

    if (!refToken) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Brak tokenu.' });

    try {
        const decoded = jwt.verify(refToken, process.env.TOKEN_REFRESH_SECRET);

        const { id, username, role } = decoded;
        const accessToken = jwt.sign({ id: id, username: username, role: role }, process.env.TOKEN_SECRET, { expiresIn: 86400 });
        res.status(StatusCodes.OK).json({ accessToken});
    } catch (err) {
        return res.sendStatus(StatusCodes.FORBIDDEN);
    }



};

module.exports = {register, login, refresh};