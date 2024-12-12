/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
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

  const products = [
    { name : "Chleb",
      description : "Pszenny",
      unit_price : 2.49,
      unit_weight : 500,
      category_id : 3},
    {
      name : "Kurtka",
      description : "Puchowa w kolorze czarnym",
      unit_price : 400,
      unit_weight : 200,
      category_id : 2
    },
    {
      name : "Smartfon",
      description : "Samsung S24",
      unit_price : 5000,
      unit_weight : 400,
      category_id : 1
    }
  ];
  await knex('products').insert(products);

  // const orders = [
  //   {
  //     status_id : 2,
  //     customer_name : "Piotrek",
  //     email : "email@email.com",
  //     phone : "123056",
  //   }
  // ];
  // await knex('orders').insert(orders);
  //
  // const order_items = [
  //   {
  //     order_id : 1,
  //     product_id : 1,
  //     quantity : 2
  //   }
  // ]
  // await knex('order_items').insert(order_items);
};
