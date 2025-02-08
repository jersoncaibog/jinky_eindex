const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'jinky_eindex',
    connectionLimit: 5
});

// Test the connection
pool.getConnection()
    .then(conn => {
        console.log('Connected to MariaDB');
        conn.release();
    })
    .catch(err => {
        console.error('Error connecting to database:', err);
    });

module.exports = pool; 