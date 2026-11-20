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

/**
 * Crea una nueva categoría en la base de datos y retorna el ID insertado.
 */
export const createCategory = async (name) => {
    try {
        const sql = `INSERT INTO categories (name) VALUES (?);`;
        const [result] = await pool.query(sql, [name]);

        if (!result || !result.insertId) {
            throw new Error('Failed to create new category.');
        }

        return result.insertId;
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        throw error;
    }
};

/**
 * Actualiza el nombre de una categoría existente por su ID.
 */
export const updateCategory = async (categoryId, name) => {
    try {
        const sql = `UPDATE categories SET name = ? WHERE category_id = ?;`;
        const [result] = await pool.query(sql, [name, categoryId]);

        if (!result || result.affectedRows === 0) {
            throw new Error(`No category found with ID ${categoryId} to update.`);
        }

        return result;
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        throw error;
    }
};