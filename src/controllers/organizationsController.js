import {
    getAllOrganizations,
    getOrganizationById,
    getProjectsByOrganizationId,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';

const DEFAULT_LOGO = '/images/default-org.png';

const validateOrganizationInput = ({ name, description, contact_email, logo }) => {
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanDescription = typeof description === 'string' ? description.trim() : '';
    const cleanEmail = typeof contact_email === 'string' ? contact_email.trim() : '';
    const cleanLogo = typeof logo === 'string' && logo.trim().length > 0
        ? logo.trim()
        : DEFAULT_LOGO;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanName || cleanName.length < 3 || cleanName.length > 100) {
        return {
            isValid: false,
            error: 'Organization name is required and must be between 3 and 100 characters.',
            data: { name: cleanName, description: cleanDescription, contact_email: cleanEmail, logo: cleanLogo }
        };
    }

    if (!cleanDescription || cleanDescription.length < 10 || cleanDescription.length > 1000) {
        return {
            isValid: false,
            error: 'Description is required and must be between 10 and 1000 characters.',
            data: { name: cleanName, description: cleanDescription, contact_email: cleanEmail, logo: cleanLogo }
        };
    }

    if (!cleanEmail || !emailRegex.test(cleanEmail) || cleanEmail.length > 150) {
        return {
            isValid: false,
            error: 'A valid contact email address is required.',
            data: { name: cleanName, description: cleanDescription, contact_email: cleanEmail, logo: cleanLogo }
        };
    }

    if (cleanLogo.length > 255) {
        return {
            isValid: false,
            error: 'Logo path or URL cannot exceed 255 characters.',
            data: { name: cleanName, description: cleanDescription, contact_email: cleanEmail, logo: cleanLogo }
        };
    }

    return {
        isValid: true,
        error: null,
        data: { name: cleanName, description: cleanDescription, contact_email: cleanEmail, logo: cleanLogo }
    };
};

/**
 * Muestra la lista de todas las organizaciones.
 */
export const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', {
            title: 'Organizations',
            currentYear: new Date().getFullYear(),
            organizations
        });
    } catch (error) {
        console.error('Error loading organizations page:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
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
            return res.status(404).render('404', {
                title: 'Organization Not Found',
                currentYear: new Date().getFullYear()
            });
        }

        const projects = await getProjectsByOrganizationId(orgId);

        res.render('organization', {
            title: organization.name,
            currentYear: new Date().getFullYear(),
            organization,
            projects
        });
    } catch (error) {
        console.error('Error loading organization details:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

/**
 * Muestra el formulario para crear una nueva organización.
 */
export const showNewOrganizationForm = async (req, res) => {
    try {
        res.render('new-organization', {
            title: 'Create New Organization',
            currentYear: new Date().getFullYear(),
            organization: {
                name: '',
                description: '',
                contact_email: '',
                logo: ''
            },
            error: null
        });
    } catch (error) {
        console.error('Error displaying new organization form:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

/**
 * Procesa el envío del formulario para crear una organización.
 */
export const processNewOrganizationForm = async (req, res) => {
    try {
        const { isValid, error, data } = validateOrganizationInput(req.body);

        if (!isValid) {
            return res.status(400).render('new-organization', {
                title: 'Create New Organization',
                currentYear: new Date().getFullYear(),
                organization: data,
                error
            });
        }

        const newOrgId = await createOrganization(data);
        res.redirect(`/organization/${newOrgId}`);
    } catch (error) {
        console.error('Error creating organization:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

/**
 * Muestra el formulario precargado para editar una organización.
 */
export const showEditOrganizationForm = async (req, res) => {
    try {
        const orgId = req.params.id;
        const organization = await getOrganizationById(orgId);

        if (!organization) {
            return res.status(404).render('404', {
                title: 'Organization Not Found',
                currentYear: new Date().getFullYear()
            });
        }

        res.render('edit-organization', {
            title: `Edit ${organization.name}`,
            currentYear: new Date().getFullYear(),
            organization,
            error: null
        });
    } catch (error) {
        console.error('Error loading edit organization form:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

/**
 * Procesa el envío del formulario para actualizar una organización.
 */
export const processEditOrganizationForm = async (req, res) => {
    const orgId = req.params.id;

    try {
        const { isValid, error, data } = validateOrganizationInput(req.body);

        if (!isValid) {
            return res.status(400).render('edit-organization', {
                title: 'Edit Organization',
                currentYear: new Date().getFullYear(),
                organization: {
                    organization_id: orgId,
                    ...data
                },
                error
            });
        }

        await updateOrganization(orgId, data);
        res.redirect(`/organization/${orgId}`);
    } catch (error) {
        console.error('Error updating organization:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};