const {StatusCodes} = require("http-status-codes");
const axios = require("axios");
const knex = require('knex')(require('../../knexfile').development);

const makeInit = async (req, res) => {
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
        // const categoriesCount = await knex('categories').count('id as count').first();
        // if (categoriesCount.count > 0) {
        //     return res.status(StatusCodes.BAD_REQUEST).json({ message: "Baza danych już zawiera kategorie." });
        // }
        const products = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Nieprawidłowe dane. Oczekiwano tablicy produktów." });
        }
        // await knex('categories').insert(categories);

        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Brak tokenu uwierzytelniającego." });
        }
        
        for (const product of products) {
            try {
                await axios.post('http://localhost:8888/products', product, 
                    {
                        headers: {
                            Cookie: `accessToken=${token}`,
                        },
                        withCredentials: true,
                    }
                );
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
};

module.exports = { makeInit };