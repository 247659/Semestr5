const knex = require('knex')(require('../../knexfile').development);
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const jwt = require("jsonwebtoken");
const moment = require("moment/moment");
const validStatusTransitions = require('../models/validStatusTransitions');
require('dotenv').config({ path: '../../.env' });

const getOrder = async (req, res) => {
    try {
        const orders = await knex('orders').select('*');
        res.json(orders);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
};

const creatOrders = async (req, res) => {
    const {customer_name, email, phone, products } = req.body;

    try {
        const status = await knex('order_statuses')
            .select('id')
            .where({ name: 'UNCONFIRMED' })
            .first();

        const status_id = status ? status.id : null;

        if (!status_id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Nie znaleziono statusu "UNCONFIRMED".' });
        }
        const token = req.cookies.accessToken;
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

        if (!customer_name || !email || !phone || !status_id || !Array.isArray(products) || products.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Wypełnij wszystkie pola formularzu" });
        }

        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(phone)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Numer telefonu zawiera nieprawidłowe znaki." });
        }

        for (const product of products) {
            if (!product.product_id || !product.quantity || product.quantity <= 0 || product.quantity !== Math.floor(product.quantity)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Nieprawidłowy format danych produktu." });
            }
        }

        if (check !== products.length) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Produkty nie istnieją w bazie" });
        }

        const [orderId] = await knex('orders').insert({
            confirmed_date:confirmationDate,
            customer_name,
            email,
            phone,
            status_id,
            user_id:userId
        });

        const orderItems = await Promise.all(
            products.map(async (product) => {
                const productData = await knex('products')
                    .select('unit_price')
                    .where({ id: product.product_id })
                    .first();

                if (!productData) {
                    throw new Error(`Product with ID ${product.product_id} not found.`);
                }

                return {
                    order_id: orderId,
                    product_id: product.product_id,
                    quantity: product.quantity,
                    unit_price: productData.unit_price, // Pobieramy cenę z bazy danych
                };
            })
        );
        await knex('order_items').insert(orderItems);

        res.status(StatusCodes.CREATED).json({ message: `Zamówienie o ID ${orderId} zostało utworzone.` });
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Błąd serwera podczas tworzenia zamówienia." });
    }
};

const updateOrders = async (req, res) => {
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
            message: `Stan zamówienia o ID ${id} został zmieniony na ${newStatus}.`
        });
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Błąd serwera podczas zmiany stanu zamówienia." });
    }
};

const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const orders = await knex('orders').select('*').where({ id });
        if (orders.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: `Zamówienie o ID ${id} nie istnieje.` });
        }
        res.json(orders);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
};

const getOrderByCustomer = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Brak tokenu uwierzytelniającego.' });
        }
        
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userID = decoded.id;

        const orders = await knex('orders').select('*').where({ user_id: userID });
        if (orders.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: `Zamówienie, którego kupującym jest ${customer_name} nie istnieje.` });
        }
        res.json(orders);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
};

const getOrderByStatus = async (req, res) => {
    const { status_id } = req.params;

    try {
        const orders = await knex('orders').select('*').where({ status_id });
        if (orders.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: `Zamówienie o statusie ${status_id} nie istnieje.` });
        }
        res.json(orders);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
};

const creatOpinion = async (req, res) => {
    const { id } = req.params; // Pobieranie ID zamówienia z parametru URL
    const { rating, content } = req.body; // Pobieranie danych opinii z ciała żądania

    try {
        if (!rating || !content  || !Number.isInteger(parseInt(rating)) || parseInt(rating) < 1 || parseInt(rating) > 5) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Nieprawidłowe dane opinii. Ocena powinna być liczbą całkowitą od 1 do 5, a treść opinii nie może być pusta.' });
        }

        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Brak tokenu uwierzytelniającego.' });
        }
        
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
};

module.exports = { getOrder, creatOrders, updateOrders, getOrderById, getOrderByCustomer, getOrderByStatus, creatOpinion };