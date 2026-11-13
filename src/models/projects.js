// src/models/projects.js
import pool from '../database/db.js';

/**
 * Obtiene todos los proyectos de servicio junto con el nombre de su organización patrocinadora.
 */
export async function getAllProjects() {
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
}

/**
 * Retrieves the next upcoming service projects limited by number_of_projects.
 */
export async function getUpcomingProjects(numberOfProjects) {
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
    // Nota: Es más seguro pasar el limit como parámetro si la librería lo soporta, o interpolarlo de forma segura
    const [rows] = await pool.query(sql, [limit]);
    return rows;
}

/**
 * Retrieves a single service project and its organization details by project ID.
 */
export async function getProjectDetails(id) {
    const sql = `
        SELECT p.project_id, p.title, p.description, p.date, p.location, 
               p.organization_id, o.name AS organization_name
        FROM projects p
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE p.project_id = ?;
    `;
    const [rows] = await pool.query(sql, [id]);
    return rows[0]; // Return the single project object
}

/**
 * Obtiene todas las categorías asociadas a un proyecto específico usando la tabla intermedia.
 */
export async function getCategoriesByProjectId(projectId) {
    const query = `
        SELECT c.category_id, c.name 
        FROM categories c
        JOIN project_categories pc ON c.category_id = pc.category_id
        WHERE pc.project_id = ?
    `;
    const [rows] = await pool.query(query, [projectId]);
    return rows;
}