import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

export async function showProjectsPage(req, res) {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        res.render('projects', {
            title: 'Upcoming Service Projects',
            currentYear: new Date().getFullYear(),
            projects
        });
    } catch (error) {
        console.error('Error retrieving upcoming projects:', error);
        res.status(500).send('Internal Server Error');
    }
}

export async function showProjectDetailsPage(req, res) {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).send('Service project not found.');
        }

        res.render('project', {
            title: project.title,
            currentYear: new Date().getFullYear(),
            project
        });
    } catch (error) {
        console.error('Error retrieving project details:', error);
        res.status(500).send('Internal Server Error');
    }
}