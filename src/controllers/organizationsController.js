import { getAllOrganizations, getOrganizationById, getProjectsByOrganizationId } from '../models/organizations.js';

/**
 * Muestra la lista de todas las organizaciones.
 */
export const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', {
            title: 'Organizations',
            currentYear: new Date().getFullYear(), // <-- Agregado aquí
            organizations
        });
    } catch (error) {
        console.error('Error loading organizations page:', error);
        res.status(500).render('500', { title: 'Internal Server Error' });
    }
};

/**
 * Muestra los detalles de una organización específica y sus proyectos.
 */
export const showOrganizationDetailsPage = async (req, res) => {
    try {
        const orgId = req.params.id;
        const organization = await getOrganizationById(orgId);

        if (!organization) {
            return res.status(404).render('404', { title: 'Organization Not Found' });
        }

        const projects = await getProjectsByOrganizationId(orgId);

        res.render('organization', {
            title: organization.name,
            currentYear: new Date().getFullYear(), // <-- Agregado aquí también por seguridad
            organization,
            projects
        });
    } catch (error) {
        console.error('Error loading organization details:', error);
        res.status(500).render('500', { title: 'Internal Server Error' });
    }
};