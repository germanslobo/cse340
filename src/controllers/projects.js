import { getUpcomingProjects, getProjectDetails, getCategoriesByProjectId } from '../models/projects.js';
import { getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

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
        res.status(500).send('Internal Server Error');
    }
}

export async function showCategoryDetailsPage(req, res) {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).send('Category not found.');
        }

        // Obtenemos todos los proyectos asociados a esta categoría
        const projects = await getProjectsByCategoryId(categoryId);

        res.render('category', { // Asegúrate de que el archivo EJS de la vista coincida con este nombre
            title: category.name,
            currentYear: new Date().getFullYear(),
            category,
            projects
        });
    } catch (error) {
        console.error('Error retrieving category details:', error);
        res.status(500).send('Internal Server Error');
    }
}