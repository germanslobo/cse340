import pool from '../database/db.js';

/**
 * Obtiene todas las organizaciones ordenadas alfabéticamente.
 */
export const getAllOrganizations = async () => {
    try {
        const sql = `SELECT organization_id, name, description, contact_email, logo FROM organizations ORDER BY name ASC;`;
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        console.error('Error al obtener las organizaciones:', error);
        throw error;
    }
};

/**
 * Obtiene una organización individual por su ID.
 */
export const getOrganizationById = async (organizationId) => {
    try {
        const sql = `SELECT organization_id, name, description, contact_email, logo FROM organizations WHERE organization_id = ?`;
        const [rows] = await pool.query(sql, [organizationId]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener la organización por ID:', error);
        throw error;
    }
};

/**
 * Obtiene todos los proyectos asociados a una organización específica.
 */
export const getProjectsByOrganizationId = async (organizationId) => {
    try {
        const sql = `SELECT project_id, title, description, location, date FROM projects WHERE organization_id = ?`;
        const [rows] = await pool.query(sql, [organizationId]);
        return rows;
    } catch (error) {
        console.error('Error al obtener proyectos de la organización:', error);
        throw error;
    }
};