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

/**
 * Obtiene una categoría individual por su ID.
 */
export async function getCategoryById(categoryId) {
    const sql = `SELECT category_id, name FROM categories WHERE category_id = ?`;
    const [rows] = await pool.query(sql, [categoryId]);
    return rows[0];
}

/**
 * Obtiene todos los proyectos asociados a una categoría específica.
 */
export async function getProjectsByCategoryId(categoryId) {
    const query = `
        SELECT p.project_id, p.title, p.description, p.date, p.location, o.name AS organization_name 
        FROM projects p
        JOIN project_categories pc ON p.project_id = pc.project_id
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE pc.category_id = ?
    `;
    const [rows] = await pool.query(query, [categoryId]);
    return rows;
}