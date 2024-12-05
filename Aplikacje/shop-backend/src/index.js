require('dotenv').config({ path: '../.env' });
const { StatusCodes } = require('http-status-codes');
const { getReasonPhrase } = require('http-status-codes');
const express = require('express');
const knex = require('knex')(require('../knexfile').development);
const app = express();
app.use(express.json());

app.get('/products', async (req, res) => {
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

app.get('/products/id', async (req, res) => {
    try {
        const productsID = await knex('products').select('id');
        res.json(productsID);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
});

app.get('/categories', async (req, res) => {
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

app.get('/orders', async (req, res) => {
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

app.get('/status', async (req, res) => {
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

app.post('/orders', async (req, res) => {
    const { customer_name, email, phone, items } = req.body;

    try {
        const [orderId] = await knex('orders').insert({
            customer_name,
            email,
            phone,
            status_id: 1, // UNCONFIRMED
            confirmed_date: null,
        });

        const orderItems = items.map((item) => ({
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
        }));
        await knex('order_items').insert(orderItems);

        res.status(201).json({ id: orderId });
    } catch (err) {
        res.status(500).json({ error: 'Could not create order' });
    }
});

// app.post('/products', async (req, res) => {
//     const { customer_name, email, phone, items } = req.body;
//
//     try {
//         const [orderId] = await knex('orders').insert({
//             customer_name,
//             email,
//             phone,
//             status_id: 1, // UNCONFIRMED
//             confirmed_date: null,
//         });
//
//         const orderItems = items.map((item) => ({
//             order_id: orderId,
//             product_id: item.product_id,
//             quantity: item.quantity,
//         }));
//         await knex('order_items').insert(orderItems);
//
//         res.status(201).json({ id: orderId });
//     } catch (err) {
//         res.status(500).json({ error: 'Could not create order' });
//     }
// });

app.post('/products', async (req, res) => {
    console.log('req.body:', req.body);
    const { name, description, unit_price, unit_weight, categoryId } = req.body;

    // Walidacja danych wejściowych
    if (!name || !unit_price || !unit_weight || !categoryId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Nieprawidłowe dane. Wymagane pola: name, price, weight, categoryId.',
        });
    }

    try {
        // Sprawdzenie, czy kategoria istnieje
        const categoryExists = await knex('categories')
            .where('id', categoryId)
            .first();

        if (!categoryExists) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `Kategoria o ID ${categoryId} nie istnieje.`,
            });
        }

        // Dodanie nowego produktu do tabeli
        const [productId] = await knex('products').insert({
            name,
            description: description || '', // Opcjonalny opis
            unit_price,
            unit_weight,
            category_id: categoryId,
        });

        // Zwrócenie ID nowego produktu
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

app.put('/products/:id', async (req, res) => {
    const { id } = req.params; // Pobranie ID z URL
    const { name, description, unit_price, unit_weight, category_id } = req.body; // Parametry produktu z ciała żądania

    try {
        // Walidacja danych
        if (!name && !description && !unit_price && !unit_weight && !category_id) {
            return res.status(400).json({ message: "Nie podano żadnych danych do aktualizacji." });
        }

        // Aktualizacja produktu w bazie danych
        const updatedRows = await knex('products')
            .where({ id })
            .update({ name, description, unit_price, unit_weight, category_id });

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Produkt o ID ${id} nie istnieje.` });
        }

        res.status(200).json({ message: `Produkt o ID ${id} został zaktualizowany.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas aktualizacji produktu." });
    }
});

app.listen(8888, () => console.log(`Server started on http://localhost:8888`));