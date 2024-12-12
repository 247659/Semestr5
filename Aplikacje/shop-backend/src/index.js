require('dotenv').config({ path: '../.env' });
const { StatusCodes } = require('http-status-codes');
const { getReasonPhrase } = require('http-status-codes');
const express = require('express');
const knex = require('knex')(require('../knexfile').development);
const app = express();
const moment = require('moment');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

app.use(express.json());

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Brak tokenu autoryzacji.' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(StatusCodes.FORBIDDEN).json({ message: 'Nieprawidłowy token.' });

        req.user = user;
        next();
    });
};

const validStatusTransitions = {
    UNCONFIRMED: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['COMPLETED', 'CANCELLED'],
    CANCELLED: [],
    COMPLETED: []
};

app.get('/products', authenticateToken, async (req, res) => {
    try {
        const products = await knex('products').select('*');
        res.json(products);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
});

app.get('/products/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const products = await knex('products').select('*').where({ id });
        res.json(products);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
});

app.post('/products', authenticateToken, async (req, res) => {
    const { name, description, unit_price, unit_weight, category_id } = req.body;

    if (unit_price <= 0 || unit_weight <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Nieprawidłowe dane. Cena lub waga mnijesza, bądź równa 0',
        });
    }

    if (!name || !description || !unit_price || !unit_weight || !category_id ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Nieprawidłowe dane. Wymagane pola: name, description, price, weight, category_id.',
        });
    }

    try {
        const categoryExists = await knex('categories')
            .where('id', category_id)
            .first();

        if (!categoryExists) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `Kategoria o ID ${category_id} nie istnieje.`,
            });
        }

        const [productId] = await knex('products').insert({
            name,
            description: description || '',
            unit_price,
            unit_weight,
            category_id: category_id,
        });

        res.status(StatusCodes.CREATED).json({
            message: 'Produkt został dodany do bazy danych.',
            productId,
        });
    } catch (error) {
        console.error('Błąd podczas dodawania produktu:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Wystąpił błąd podczas dodawania produktu.',
        });
    }
});

app.put('/products/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.unit_price <= 0 || updateData.unit_weight <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Nieprawidłowe dane. Cena lub waga mnijesza, bądź równa 0',
        });
    }

    if (updateData.name === '' || updateData.description === '' || updateData.category_id === '' ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Nieprawidłowe dane. Wymagane pola: name, price, weight, categoryId.',
        });
    }

    try {
        if (Object.keys(updateData).length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Nie podano żadnych danych do aktualizacji." });
        }

        const updatedRows = await knex('products')
            .where({ id })
            .update(updateData);

        if (updatedRows === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: `Produkt o ID ${id} nie istnieje.` });
        }

        res.status(StatusCodes.OK).json({ message: `Produkt o ID ${id} został zaktualizowany.` });
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Błąd serwera podczas aktualizacji produktu." });
    }
});

app.get('/categories', authenticateToken, async (req, res) => {
    try {
        const categories = await knex('categories').select('*');
        res.json(categories);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
});

app.get('/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await knex('orders').select('*');
        res.json(orders);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
});

app.post('/orders', async (req, res) => {
    const {status_id, customer_name, email, phone, products } = req.body;

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Brak tokenu autoryzacyjnego.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.id;

        let confirmationDate;
        if (status_id === 14) {
            confirmationDate = moment().format('YYYY-MM-DD HH:mm:ss');
        }

        const productIds = await knex('products').select('id');

        let check = 0;

        for (const productNew of products)  {
            for (const product of productIds) {
                if (productNew.product_id === product.id){
                    check = check + 1;
                }
            }
        }

        if (check !== products.length) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Produkty nie istnieją w bazie" });
        }

        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(phone)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Numer telefonu zawiera nieprawidłowe znaki." });
        }

        if (!customer_name || !email || !phone || !status_id || !Array.isArray(products) || products.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Brakuje wymaganych danych zamówienia lub lista produktów jest pusta." });
        }

        for (const product of products) {
            if (!product.product_id || !product.quantity || product.quantity <= 0 || product.quantity !== Math.floor(product.quantity)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Nieprawidłowy format danych produktu." });
            }
        }

        const [orderId] = await knex('orders').insert({
            confirmed_date:confirmationDate,
            customer_name,
            email,
            phone,
            status_id,
            user_id:userId
        });

        const orderItems = products.map(product => ({
            order_id: orderId,
            product_id: product.product_id,
            quantity: product.quantity,
        }));
        await knex('order_items').insert(orderItems);

        res.status(StatusCodes.CREATED).json({ message: `Zamówienie o ID ${orderId} zostało utworzone.` });
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Błąd serwera podczas tworzenia zamówienia." });
    }
});

app.patch('/orders/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { newStatus } = req.body;

    try {
        const order = await knex('orders')
            .select('orders.id', 'status_id', 'name')
            .join('order_statuses', 'orders.status_id', 'order_statuses.id')
            .where('orders.id', id)
            .first();

        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: `Zamówienie o ID ${id} nie istnieje.` });
        }

        const currentStatus = order.name;

        if (!newStatus) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Nie podano nowego stanu zamówienia." });
        }

        const status = await knex('order_statuses')
            .select('id', 'name')
            .where('name', newStatus)
            .first();

        if (!status) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: `Stan zamówienia "${newStatus}" nie istnieje.` });
        }

        if (!validStatusTransitions[currentStatus]?.includes(newStatus)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: `Nie można zmienić stanu zamówienia z "${currentStatus}" na "${newStatus}".`
            });
        }

        let confirmationDate;
        if (newStatus === 'CONFIRMED') {
            confirmationDate = moment().format('YYYY-MM-DD HH:mm:ss');
        }

        await knex('orders')
            .where('id', id)
            .update({ status_id: status.id, confirmed_date: confirmationDate});

        res.status(StatusCodes.OK).json({
            message: `Stan zamówienia o ID ${id} został zmieniony na "${newStatus}".`
        });
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Błąd serwera podczas zmiany stanu zamówienia." });
    }
});

app.get('/orders/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const orders = await knex('orders').select('*').where({ id });
        res.json(orders);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
});

app.get('/orders/customer/:customer_name', authenticateToken, async (req, res) => {
    const { customer_name } = req.params;

    try {
        const orders = await knex('orders').select('*').where({ customer_name });
        res.json(orders);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
});

app.get('/orders/status/:status_id', authenticateToken, async (req, res) => {
    const { status_id } = req.params;

    try {
        const orders = await knex('orders').select('*').where({ status_id });
        res.json(orders);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
});

app.get('/status', authenticateToken, async (req, res) => {
    try {
        const status = await knex('order_statuses').select('*');
        res.json(status);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
});

app.post('/orders/:id/opinions', async (req, res) => {
    const { id } = req.params; // Pobieranie ID zamówienia z parametru URL
    const { rating, content } = req.body; // Pobieranie danych opinii z ciała żądania

    try {
        if (!rating || !content || typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Nieprawidłowe dane opinii. Ocena powinna być liczbą całkowitą od 1 do 5, a treść opinii nie może być pusta.' });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Brak tokenu autoryzacyjnego." });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.id;


        const order = await knex('orders')
            .select('id', 'status_id', 'user_id')
            .where({ id })
            .first();

        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: `Zamówienie o ID ${id} nie istnieje.` });
        }

        console.log(userId);
        console.log(order.user_id);
        if (order.user_id !== userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Nie możesz dodać opinii do tego zamówienia." });
        }

        const allowedStatuses = ['COMPLETED', 'CANCELLED'];

        const orderStatus = await knex('order_statuses')
            .select('name')
            .where({ id: order.status_id })
            .first();

        if (!allowedStatuses.includes(orderStatus.name)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Opinię można dodać tylko do zamówienia, które jest ZREALIZOWANE lub ANULOWANE.' });
        }

        const [newOpinionId] = await knex('opinions').insert({
            order_id: id,
            rating,
            content
        });

        res.status(StatusCodes.CREATED).json({ message: 'Opinia została dodana.', opinion_id: newOpinionId });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera podczas dodawania opinii.' });
    }
});

app.post('/products/:id/seo-description', authenticateToken,  async (req, res) => {
    const { id } = req.params;
    const apiKey = process.env["API_KEY_GROQ"];
    let product;

    try {
        const products = await knex('products').select('*').where({ id });
        product = products[0];
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }

    const productData = {
        name: product.name,
        description: product.description,
        unit_price: product.unit_price,
        unit_weight: product.unit_weight,
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    };

    const body = {
        messages: [
            {
                role: 'system',
                content: `You are a description model that creates concise, SEO-friendly product descriptions in valid HTML format. Do not add any additional notes, explanations, or comments.. 
                The input must conform to the following JSON schema: ${productData}. The output should be in html format`,
            },
            {
                role: 'user',
                content: `Generate an SEO-friendly HTML description for the following product: ${JSON.stringify(productData)}. 
               Only include the HTML structure and the required content. Avoid including any extra notes or instructions in your response. `,
            }
        ],
        model: "llama3-8b-8192",
        temperature: 0
    };
    
    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', body, { headers });
        const seoDescription = response.data.choices[0].message.content;

        res.status(StatusCodes.OK).send(`
        <html lang="pl">
            <body>
                ${seoDescription}
            </body>
        </html>
    `);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            message: 'Nie udało się wygenerować opisu SEO.',
        });
    }
});

app.post('/init', authenticateToken, async (req, res) => {
    let errors = [];
    let correct = [];
    const categories = [
        {id: 1, name: 'Electronics' },
        {id: 2, name: 'Clothing' },
        {id: 3, name: 'Food' },
    ];
    try {
        await knex.raw('ALTER TABLE products AUTO_INCREMENT = 1');
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Błąd podczas resetowania auto-increment:", error });
    }
    try {
        const productCount = await knex('products').count('id as count').first();
        if (productCount.count > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Baza danych już zawiera produkty." });
        }
        const categoriesCount = await knex('categories').count('id as count').first();
        if (categoriesCount.count > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Baza danych już zawiera kategorie." });
        }
        const products = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Nieprawidłowe dane. Oczekiwano tablicy produktów." });
        }
        await knex('categories').insert(categories);
        for (const product of products) {
            try {
                await axios.post('http://localhost:8888/products', product, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                correct.push({
                    message: `Dodano: ${product.name}`,
                })
            } catch (error) {
                errors.push({
                    error: error.response?.data || error.message,
                    product,
                });
            }
        }
        if (errors.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Niektóre produkty nie zostały dodane.",
                errors,
                correct,
            });
        }
        res.status(StatusCodes.OK).json({ message: "Baza danych została zainicjalizowana." });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Błąd serwera podczas inicjalizacji bazy danych." });
    }
});

app.post('/register', async (req, res) => {
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
        res.status(StatusCodes.CREATED).json({ message: 'Użytkownik zarejestrowany.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera.' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await knex('users').where({ username }).first();
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Nieprawidłowe dane logowania.' });
        }

        const accessToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: 86400 });
        const refreshToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.TOKEN_REFRESH_SECRET, { expiresIn: 525600 });

        res.status(StatusCodes.OK).json({ accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera.' });
    }
});

app.post('/refresh', async (req, res) => {
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



});

app.listen(8888, () => console.log(`Server started on http://localhost:8888`));