const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: `${process.env.PG_PASS}`,
  database: `${process.env.PG_DB_NAME}`
})

module.exports = client;