const {StatusCodes, getReasonPhrase} = require("http-status-codes");
const knex = require('knex')(require('../../knexfile').development);

const getCategories = async (req, res) => {
    try {
        const categories = await knex('categories').select('*');
        res.json(categories);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
};

module.exports = {getCategories};