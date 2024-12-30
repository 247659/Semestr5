require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express();
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