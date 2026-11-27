import { validationResult } from 'express-validator';
import {
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    createProject,
    updateProject,
    updateProjectCategories,
    addVolunteer,
    removeVolunteer,
    isUserVolunteering
} from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { getAllCategories } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const buildProjectPayload = ({ title, description, location, date, organization_id }) => {
    const parsedOrgId = parseInt(organization_id, 10);

    return {
        title: typeof title === 'string' ? title.trim() : '',
        description: typeof description === 'string' ? description.trim() : '',
        location: typeof location === 'string' ? location.trim() : '',
        date: typeof date === 'string' ? date.trim() : '',
        organization_id: Number.isNaN(parsedOrgId) || parsedOrgId <= 0 ? '' : parsedOrgId
    };
};

export const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        res.render('projects', {
            title: 'Upcoming Service Projects',
            currentYear: new Date().getFullYear(),
            projects
        });
    } catch (error) {
        console.error('Error retrieving upcoming projects:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

export const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).render('404', {
                title: 'Service Project Not Found',
                currentYear: new Date().getFullYear()
            });
        }

        const categories = await getCategoriesByProjectId(projectId);
        const currentUser = req.session?.user || null;
        const isVolunteering = currentUser
            ? await isUserVolunteering(currentUser.user_id, projectId)
            : false;

        res.render('project', {
            title: project.title,
            currentYear: new Date().getFullYear(),
            project,
            categories,
            isVolunteering
        });
    } catch (error) {
        console.error('Error retrieving project details:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

export const volunteerForProject = async (req, res) => {
    try {
        const projectId = parseInt(req.params.id, 10);
        const userId = req.session.user.user_id;

        if (Number.isNaN(projectId)) {
            return res.status(400).redirect('/projects');
        }

        const project = await getProjectDetails(projectId);
        if (!project) {
            return res.status(404).render('404', {
                title: 'Service Project Not Found',
                currentYear: new Date().getFullYear()
            });
        }

        await addVolunteer(userId, projectId);
        req.session.flashMessage = {
            type: 'success',
            text: `You are now volunteering for "${project.title}"!`
        };

        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error volunteering for project:', error);
        return res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

export const removeVolunteerFromProject = async (req, res) => {
    try {
        const projectId = parseInt(req.params.id, 10);
        const userId = req.session.user.user_id;
        const redirectTarget = req.query.redirect || req.body?.redirect;

        if (Number.isNaN(projectId)) {
            return res.status(400).redirect('/projects');
        }

        await removeVolunteer(userId, projectId);
        req.session.flashMessage = {
            type: 'success',
            text: 'You have been removed as a volunteer from this project.'
        };

        if (redirectTarget === 'dashboard') {
            return res.redirect('/dashboard');
        }

        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error removing volunteer from project:', error);
        return res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

export const showNewProjectForm = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('new-project', {
            title: 'Create New Service Project',
            currentYear: new Date().getFullYear(),
            project: {
                title: '',
                description: '',
                location: '',
                date: '',
                organization_id: ''
            },
            organizations,
            error: null
        });
    } catch (error) {
        console.error('Error loading new project form:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

export const processNewProjectForm = async (req, res) => {
    try {
        const errors = validationResult(req);
        const data = buildProjectPayload(req.body);

        if (!errors.isEmpty()) {
            const errorMessage = errors.array().map((err) => err.msg).join(' ');
            const organizations = await getAllOrganizations();
            return res.status(400).render('new-project', {
                title: 'Create New Service Project',
                currentYear: new Date().getFullYear(),
                project: data,
                organizations,
                error: errorMessage
            });
        }

        const newProjectId = await createProject(data);
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

export const showEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).render('404', {
                title: 'Service Project Not Found',
                currentYear: new Date().getFullYear()
            });
        }

        const organizations = await getAllOrganizations();

        res.render('edit-project', {
            title: `Edit ${project.title}`,
            currentYear: new Date().getFullYear(),
            project,
            organizations,
            error: null
        });
    } catch (error) {
        console.error('Error loading edit project form:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

export const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    try {
        const errors = validationResult(req);
        const data = buildProjectPayload(req.body);

        if (!errors.isEmpty()) {
            const errorMessage = errors.array().map((err) => err.msg).join(' ');
            const organizations = await getAllOrganizations();
            return res.status(400).render('edit-project', {
                title: 'Edit Service Project',
                currentYear: new Date().getFullYear(),
                project: {
                    project_id: projectId,
                    ...data
                },
                organizations,
                error: errorMessage
            });
        }

        await updateProject(projectId, data);
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

export const showAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).render('404', {
                title: 'Service Project Not Found',
                currentYear: new Date().getFullYear()
            });
        }

        const allCategories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);
        const assignedCategoryIds = assignedCategories.map((cat) => Number(cat.category_id));

        res.render('assign-categories', {
            title: `Assign Categories - ${project.title}`,
            currentYear: new Date().getFullYear(),
            project,
            allCategories,
            assignedCategoryIds
        });
    } catch (error) {
        console.error('Error loading assign categories form:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

export const processAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { categoryIds } = req.body;

        await updateProjectCategories(projectId, categoryIds);
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error assigning categories to project:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};