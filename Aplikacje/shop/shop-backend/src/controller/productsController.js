const knex = require('knex')(require('../../knexfile').development);
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const axios = require("axios");
require('dotenv').config({ path: '../../.env' });

const getProducts = async (req, res) => {
    try {
        const products = await knex('products').select('*');
        res.json(products);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const products = await knex('products').select('*').where({ id });
        if (products.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: `Produkt o ID ${id} nie istnieje.` });
        }

        res.json(products);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
};

const createProduct = async (req, res) => {
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
};

const updateProduct = async (req, res) => {
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
};

const seoDescription = async (req, res) => {
    const { id } = req.params;
    const apiKey = process.env.API_KEY_GROQ;
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
    console.log(product);
    if (product === undefined) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: `Produkt o ID ${id} nie istnieje.` });
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
};



module.exports = { getProducts, getProductById, createProduct, updateProduct, seoDescription };