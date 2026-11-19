// src/models/categories.js
import pool from '../database/db.js';

/**
 * Obtiene todas las categorías de la base de datos ordenadas alfabéticamente por nombre.
 */
export const getAllCategories = async () => {
    try {
        const sql = `SELECT category_id, name FROM categories ORDER BY name ASC;`;
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        throw error;
    }
};

/**
 * Obtiene una categoría individual por su ID.
 */
export const getCategoryById = async (categoryId) => {
    try {
        const sql = `SELECT category_id, name FROM categories WHERE category_id = ?`;
        const [rows] = await pool.query(sql, [categoryId]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener la categoría por ID:', error);
        throw error;
    }
};

/**
 * Obtiene todos los proyectos asociados a una categoría específica.
 */
export const getProjectsByCategoryId = async (categoryId) => {
    try {
        const query = `
            SELECT p.project_id, p.title, p.description, p.date, p.location, o.name AS organization_name 
            FROM projects p
            JOIN project_categories pc ON p.project_id = pc.project_id
            JOIN organizations o ON p.organization_id = o.organization_id
            WHERE pc.category_id = ?
        `;
        const [rows] = await pool.query(query, [categoryId]);
        return rows;
    } catch (error) {
        console.error('Error al obtener proyectos de la categoría:', error);
        throw error;
    }
};