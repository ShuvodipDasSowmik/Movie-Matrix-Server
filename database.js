const mysql = require('mysql2');
require('dotenv').config();

// Creating a connection pool is better than creating a single connection
// because it allows multiple connections to be handled efficiently
// and can improve performance in a multi-threaded environment.

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,

  // Setting it to false will make the connection vulnerable to Man in the middle/ MITM attacks
  // Setting it to true will make the connection secure

  ssl: {
    rejectUnauthorized: false,
  }
}).promise();



// Test with a simple query to check if the connection is successful

pool.query('SELECT 1')
  .then(() => {
    console.log('Successfully connected to MySQL database\n');
  })
  .catch(err => {
    console.error('Failed to connect to MySQL:', err);
    if (err.code === 'ENOTFOUND') {
      console.error('Cannot resolve database hostname. Please check your DB_HOST value and network connectivity.');
    }
  });

module.exports = pool;
