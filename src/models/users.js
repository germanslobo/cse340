// src/models/users.js
import pool from '../database/db.js';

export async function findUserByEmail(email) {
    const [rows] = await pool.execute(
        'SELECT user_id, name, email, password_hash, role, created_at FROM users WHERE email = ? LIMIT 1',
        [email]
    );
    return rows[0] || null;
}

export async function createUser({ name, email, passwordHash, role = 'user' }) {
    const [result] = await pool.execute(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [name, email, passwordHash, role]
    );
    return result.insertId;
}

export async function getAllUsers() {
    const [rows] = await pool.execute(
        'SELECT user_id, name, email, role, created_at FROM users ORDER BY user_id ASC'
    );
    return rows;
}