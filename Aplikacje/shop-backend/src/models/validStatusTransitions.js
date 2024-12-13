const validStatusTransitions = {
    UNCONFIRMED: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['COMPLETED', 'CANCELLED'],
    CANCELLED: [],
    COMPLETED: []
};

module.exports = validStatusTransitions;