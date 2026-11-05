// src/models/categories.js
import pool from '../database/db.js';

/**
 * Obtiene todas las categorías de la base de datos ordenadas alfabéticamente por nombre.
 */
export async function getAllCategories() {
    try {
        const sql = `SELECT category_id, name FROM categories ORDER BY name ASC;`;
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        throw error;
    }
}