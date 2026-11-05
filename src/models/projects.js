// src/models/projects.js
import pool from '../database/db.js';

/**
 * Obtiene todos los proyectos de servicio junto con el nombre de su organización patrocinadora.
 * Realiza un JOIN entre la tabla projects y organizations[cite: 4].
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