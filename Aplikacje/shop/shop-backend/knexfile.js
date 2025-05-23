require('dotenv').config();

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    },
    migrations: {
      tableName: 'migrations',
      directory: './src/database/migrations',
    },
    seeds: {
      tableName: 'seeds',
      directory: './src/database/seeds',
    },
  },
};