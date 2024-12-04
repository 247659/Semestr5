/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('order_items').del();
  await knex('orders').del();
  await knex('order_statuses').del();
  await knex('products').del();
  await knex('categories').del();

  const categories = [
    { name: 'Electronics' },
    { name: 'Clothing' },
    { name: 'Food' },
  ];
  await knex('categories').insert(categories);

  const orderStatuses = [
    { name: 'UNCONFIRMED' },
    { name: 'CONFIRMED' },
    { name: 'CANCELLED' },
    { name: 'COMPLETED' },
  ];
  await knex('order_statuses').insert(orderStatuses);
};
