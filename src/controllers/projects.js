import {
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    updateProject
} from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

        res.render('project', {
            title: project.title,
            currentYear: new Date().getFullYear(),
            project,
            categories
        });
    } catch (error) {
        console.error('Error retrieving project details:', error);
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
            organizations
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
    try {
        const projectId = req.params.id;
        const { title, description, location, date, organization_id } = req.body;

        await updateProject(projectId, {
            title,
            description,
            location,
            date,
            organization_id
        });

        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};