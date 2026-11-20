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

/**
 * Crea una nueva organización en la base de datos y devuelve su ID.
 */
export const createOrganization = async ({ name, description, contact_email, logo }) => {
    try {
        const sql = `
            INSERT INTO organizations (name, description, contact_email, logo)
            VALUES (?, ?, ?, ?);
        `;
        const params = [name, description, contact_email, logo];
        const [result] = await pool.query(sql, params);

        if (!result || !result.insertId) {
            throw new Error('Failed to create new organization.');
        }

        return result.insertId;
    } catch (error) {
        console.error('Error al crear la organización:', error);
        throw error;
    }
};

/**
 * Actualiza una organización existente por su ID.
 */
export const updateOrganization = async (organizationId, { name, description, contact_email, logo }) => {
    try {
        const sql = `
            UPDATE organizations
            SET name = ?,
                description = ?,
                contact_email = ?,
                logo = ?
            WHERE organization_id = ?;
        `;
        const params = [name, description, contact_email, logo, organizationId];
        const [result] = await pool.query(sql, params);

        if (!result || result.affectedRows === 0) {
            throw new Error(`No organization found with ID ${organizationId} to update.`);
        }

        return result;
    } catch (error) {
        console.error('Error al actualizar la organización:', error);
        throw error;
    }
};