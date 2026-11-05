// src/database/db.js
import mysql from 'mysql2/promise';

// Configura el pool de conexiones usando tu base de datos local 'cse340'
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',          // Cambia esto si tu usuario de MySQL es diferente
    password: 'Soyexitoso77$$',          // Pon tu contraseña de MySQL aquí si tienes una (déjala vacía '' si no usas contraseña)
    database: 'cse340',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;