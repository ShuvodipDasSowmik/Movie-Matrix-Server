const { Pool } = require('pg');
require('dotenv').config();

// Creating a connection pool is better than creating a single connection
// because it allows multiple connections to be handled efficiently
// and can improve performance in a multi-threaded environment.


const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});



// Test with a simple query to check if the connection is successful

pool.query('SELECT 1')
  .then(() => {
    console.log('Successfully connected to PostgreSQL database\n');
  })
  .catch(err => {
    console.error('Failed to connect to PostgreSQL:', err);
    if (err.code === 'ENOTFOUND') {
      console.error('Cannot resolve database hostname. Please check your Connection String and network connectivity.');
    }
  });

module.exports = pool;
