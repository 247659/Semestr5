require('dotenv').config({ path: '../.env' });
const { StatusCodes } = require('http-status-codes');
const { getReasonPhrase } = require('http-status-codes');
const express = require('express');
const knex = require('knex')(require('../knexfile').development);
const app = express();
app.use(express.json());

const validStatusTransitions = {
    UNCONFIRMED: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['COMPLETED', 'CANCELLED'],
    CANCELLED: [],
    COMPLETED: []
};

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

app.get('/products/:id', async (req, res) => {
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

app.post('/products', async (req, res) => {
    const { name, description, unit_price, unit_weight, categoryId } = req.body;

    if (!name || !unit_price || !unit_weight || !categoryId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Nieprawidłowe dane. Wymagane pola: name, price, weight, categoryId.',
        });
    }

    try {
        const categoryExists = await knex('categories')
            .where('id', categoryId)
            .first();

        if (!categoryExists) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `Kategoria o ID ${categoryId} nie istnieje.`,
            });
        }

        const [productId] = await knex('products').insert({
            name,
            description: description || '', // Opcjonalny opis
            unit_price,
            unit_weight,
            category_id: categoryId,
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

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Nie podano żadnych danych do aktualizacji." });
        }

        const updatedRows = await knex('products')
            .where({ id })
            .update(updateData);

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Produkt o ID ${id} nie istnieje.` });
        }

        res.status(200).json({ message: `Produkt o ID ${id} został zaktualizowany.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas aktualizacji produktu." });
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

app.post('/orders', async (req, res) => {
    const {status_id, customer_name, email, phone, products } = req.body;

    try {
        // Walidacja wymaganych danych
        if (!customer_name || !email || !phone || !status_id || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Brakuje wymaganych danych zamówienia lub lista produktów jest pusta." });
        }

        // Walidacja produktów
        for (const product of products) {
            if (!product.product_id || !product.quantity || product.quantity <= 0) {
                return res.status(400).json({ message: "Nieprawidłowy format danych produktu." });
            }
        }

        // Dodanie zamówienia
        const [orderId] = await knex('orders').insert({
            customer_name,
            email,
            phone,
            status_id,
        });

        // Dodanie produktów do zamówienia
        const orderItems = products.map(product => ({
            order_id: orderId,
            product_id: product.product_id,
            quantity: product.quantity,
        }));
        await knex('order_items').insert(orderItems);

        res.status(201).json({ message: `Zamówienie o ID ${orderId} zostało utworzone.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas tworzenia zamówienia." });
    }
});

app.patch('/orders/:id', async (req, res) => {
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

        await knex('orders')
            .where('id', id)
            .update({ status_id: status.id });

        res.status(StatusCodes.OK).json({
            message: `Stan zamówienia o ID ${id} został zmieniony na "${newStatus}".`
        });
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Błąd serwera podczas zmiany stanu zamówienia." });
    }
});

app.get('/orders/:id', async (req, res) => {
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

app.get('/orders/customer/:customer_name', async (req, res) => {
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

app.get('/orders/status/:status_id', async (req, res) => {
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

app.listen(8888, () => console.log(`Server started on http://localhost:8888`));