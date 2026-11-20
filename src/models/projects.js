// src/models/projects.js
import pool from '../database/db.js';

/**
 * Obtiene todos los proyectos de servicio junto con el nombre de su organización patrocinadora.
 */
export const getAllProjects = async () => {
    try {
        const sql = `
            SELECT 
                p.project_id,
                p.title,
                p.description,
                p.location,
                p.date,
                o.name AS organization_name
            FROM projects p
            JOIN organizations o ON p.organization_id = o.organization_id
            ORDER BY p.date ASC;
        `;
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        console.error('Error al obtener los proyectos de servicio:', error);
        throw error;
    }
};

/**
 * Retrieves the next upcoming service projects limited by number_of_projects.
 */
export const getUpcomingProjects = async (numberOfProjects) => {
    try {
        const limit = parseInt(numberOfProjects, 10);
        const sql = `
            SELECT p.project_id, p.title, p.description, p.date, p.location, 
                   p.organization_id, o.name AS organization_name
            FROM projects p
            JOIN organizations o ON p.organization_id = o.organization_id
            WHERE p.date >= CURDATE()
            ORDER BY p.date ASC
            LIMIT ?;
        `;
        const [rows] = await pool.query(sql, [limit]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los próximos proyectos:', error);
        throw error;
    }
};

/**
 * Retrieves a single service project and its organization details by project ID.
 */
export const getProjectDetails = async (id) => {
    try {
        const sql = `
            SELECT p.project_id, p.title, p.description, p.date, p.location, 
                   p.organization_id, o.name AS organization_name
            FROM projects p
            JOIN organizations o ON p.organization_id = o.organization_id
            WHERE p.project_id = ?;
        `;
        const [rows] = await pool.query(sql, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener los detalles del proyecto:', error);
        throw error;
    }
};

/**
 * Obtiene todas las categorías asociadas a un proyecto específico usando la tabla intermedia.
 */
export const getCategoriesByProjectId = async (projectId) => {
    try {
        const query = `
            SELECT c.category_id, c.name 
            FROM categories c
            JOIN project_categories pc ON c.category_id = pc.category_id
            WHERE pc.project_id = ?
        `;
        const [rows] = await pool.query(query, [projectId]);
        return rows;
    } catch (error) {
        console.error('Error al obtener categorías del proyecto:', error);
        throw error;
    }
};

/**
 * Crea un nuevo proyecto de servicio en la base de datos y devuelve su ID.
 */
export const createProject = async ({ title, description, location, date, organization_id }) => {
    try {
        const sql = `
            INSERT INTO projects (title, description, location, date, organization_id)
            VALUES (?, ?, ?, ?, ?);
        `;
        const params = [title, description, location, date, organization_id];
        const [result] = await pool.query(sql, params);

        if (!result || !result.insertId) {
            throw new Error('Failed to create new service project.');
        }

        return result.insertId;
    } catch (error) {
        console.error('Error al crear el proyecto de servicio:', error);
        throw error;
    }
};

/**
 * Actualiza un proyecto de servicio existente en la base de datos.
 */
export const updateProject = async (projectId, { title, description, location, date, organization_id }) => {
    try {
        const sql = `
            UPDATE projects
            SET title = ?,
                description = ?,
                location = ?,
                date = ?,
                organization_id = ?
            WHERE project_id = ?;
        `;
        const params = [title, description, location, date, organization_id, projectId];
        const [result] = await pool.query(sql, params);

        if (!result || result.affectedRows === 0) {
            throw new Error(`No project found with ID ${projectId} to update.`);
        }

        return result;
    } catch (error) {
        console.error('Error al actualizar el proyecto:', error);
        throw error;
    }
};

/**
 * Reemplaza las categorías asignadas a un proyecto dentro de una transacción.
 */
export const updateProjectCategories = async (projectId, categoryIds = []) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(
            'DELETE FROM project_categories WHERE project_id = ?;',
            [projectId]
        );

        const normalizedIds = Array.isArray(categoryIds)
            ? categoryIds.map((id) => parseInt(id, 10)).filter((id) => !Number.isNaN(id))
            : categoryIds
                ? [parseInt(categoryIds, 10)].filter((id) => !Number.isNaN(id))
                : [];

        if (normalizedIds.length > 0) {
            const values = normalizedIds.map((categoryId) => [projectId, categoryId]);
            await connection.query(
                'INSERT INTO project_categories (project_id, category_id) VALUES ?;',
                [values]
            );
        }

        await connection.commit();
        return normalizedIds;
    } catch (error) {
        await connection.rollback();
        console.error('Error al actualizar las categorías del proyecto:', error);
        throw error;
    } finally {
        connection.release();
    }
};