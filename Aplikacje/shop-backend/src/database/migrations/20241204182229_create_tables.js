/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('categories', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
        })
        .createTable('products', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.text('description');
            table.decimal('unit_price', 10, 2).notNullable();
            table.decimal('unit_weight', 10, 3).notNullable();
            table.integer('category_id').unsigned().notNullable()
                .references('id').inTable('categories')
                .onDelete('CASCADE');
        })
        .createTable('order_statuses', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
        })
        .createTable('orders', (table) => {
            table.increments('id').primary();
            table.dateTime('confirmed_date').nullable();
            table.integer('status_id').unsigned().notNullable()
                .references('id').inTable('order_statuses')
                .onDelete('CASCADE');
            table.string('customer_name').notNullable();
            table.string('email').notNullable();
            table.string('phone').notNullable();
        })
        .createTable('order_items', (table) => {
            table.increments('id').primary();
            table.integer('order_id').unsigned().notNullable()
                .references('id').inTable('orders')
                .onDelete('CASCADE');
            table.integer('product_id').unsigned().notNullable()
                .references('id').inTable('products')
                .onDelete('CASCADE');
            table.integer('quantity').unsigned().notNullable();
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('order_items')
        .dropTableIfExists('orders')
        .dropTableIfExists('order_statuses')
        .dropTableIfExists('products')
        .dropTableIfExists('categories');
};
