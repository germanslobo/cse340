import { getUpcomingProjects, getProjectDetails, getCategoriesByProjectId } from '../models/projects.js';

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
        res.status(500).render('500', { title: 'Internal Server Error' });
    }
};

export const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).render('404', { title: 'Service Project Not Found' });
        }

        // Obtenemos las categorías asociadas a este proyecto para mostrarlas como etiquetas
        const categories = await getCategoriesByProjectId(projectId);

        res.render('project', {
            title: project.title,
            currentYear: new Date().getFullYear(),
            project,
            categories
        });
    } catch (error) {
        console.error('Error retrieving project details:', error);
        res.status(500).render('500', { title: 'Internal Server Error' });
    }
};