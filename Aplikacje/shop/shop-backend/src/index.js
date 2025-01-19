require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Adres Twojego frontendu
    methods: ['GET', 'POST', 'PUT', 'DELETE', "PATCH"], // Dopuszczalne metody
    credentials: true, // Jeśli potrzebujesz ciasteczek lub nagłówków autoryzacji
  }));

app.use(cookieParser());
const productRoutes = require('./routes/productRoutes');
const ordersRoutes = require('./routes/orderRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const initializationRoutes = require('./routes/initializationRoutes');
const statusRoutes = require('./routes/statusRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.use('/products', productRoutes);

app.use('/orders', ordersRoutes);

app.use('/categories', categoriesRoutes);

app.use('/init', initializationRoutes);

app.use('/status', statusRoutes);

app.use('/auth', authRoutes);

app.listen(8888, () => console.log(`Server started on http://localhost:8888`));