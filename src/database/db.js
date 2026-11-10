// src/database/db.js
import mysql from 'mysql2/promise';

// Configura el pool de conexiones usando variables de entorno o valores locales por defecto
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'Soyexitoso77$$',
    database: process.env.DB_NAME || 'cse340',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;