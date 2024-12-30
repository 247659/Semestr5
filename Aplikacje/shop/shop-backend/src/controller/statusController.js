const {StatusCodes, getReasonPhrase} = require("http-status-codes");
const knex = require('knex')(require('../../knexfile').development);

const getStatus = async (req, res) => {
    try {
        const status = await knex('order_statuses').select('*');
        res.json(status);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
};

module.exports = { getStatus };