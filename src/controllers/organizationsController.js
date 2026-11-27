import { validationResult } from 'express-validator';
import {
    getAllOrganizations,
    getOrganizationById,
    getProjectsByOrganizationId,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';

const DEFAULT_LOGO = '/images/default-org.png';

const buildOrganizationPayload = ({ name, description, contact_email, logo }) => ({
    name: typeof name === 'string' ? name.trim() : '',
    description: typeof description === 'string' ? description.trim() : '',
    contact_email: typeof contact_email === 'string' ? contact_email.trim() : '',
    logo: typeof logo === 'string' && logo.trim().length > 0
        ? logo.trim()
        : DEFAULT_LOGO
});

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

export const processNewOrganizationForm = async (req, res) => {
    try {
        const errors = validationResult(req);
        const data = buildOrganizationPayload(req.body);

        if (!errors.isEmpty()) {
            const errorMessage = errors.array().map((err) => err.msg).join(' ');
            return res.status(400).render('new-organization', {
                title: 'Create New Organization',
                currentYear: new Date().getFullYear(),
                organization: data,
                error: errorMessage
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

export const processEditOrganizationForm = async (req, res) => {
    const orgId = req.params.id;

    try {
        const errors = validationResult(req);
        const data = buildOrganizationPayload(req.body);

        if (!errors.isEmpty()) {
            const errorMessage = errors.array().map((err) => err.msg).join(' ');
            return res.status(400).render('edit-organization', {
                title: 'Edit Organization',
                currentYear: new Date().getFullYear(),
                organization: {
                    organization_id: orgId,
                    ...data
                },
                error: errorMessage
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