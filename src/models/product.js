// src/models/projects.js
import pool from '../database/db.js'; // Ajusta esta ruta si tu archivo de conexión está en otra carpeta (ej. ../config/db.js)

/**
 * Obtiene todos los proyectos de servicio junto con el nombre de su organización patrocinadora.
 * Realiza un JOIN entre la tabla projects y organizations.
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
        
        // Ejecuta la consulta en la base de datos usando promesas
        const [rows] = await pool.query(sql);
        return rows;
        
    } catch (error) {
        console.error('Error al obtener los proyectos de servicio:', error);
        throw error;
    }
}