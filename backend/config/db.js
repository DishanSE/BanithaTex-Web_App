const { Pool } = require('pg');
require('dotenv').config();

// Create a PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DB_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false } // Required for Supabase
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to Supabase:', err.stack);
    return;
  }
  console.log('Connected to Supabase database');
  release();
});

module.exports = pool;