import express from 'express';
import { showHomePage } from './controllers/mainController.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage
} from './controllers/organizationsController.js';
import {
    showProjectsPage,
    showProjectDetailsPage,
    showEditProjectForm,
    processEditProjectForm
} from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage
} from './controllers/categoriesController.js';

const router = express.Router();

// Ruta principal
router.get('/', showHomePage);

// Rutas de organizaciones
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Rutas de proyectos de servicio
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Rutas para editar un proyecto de servicio (W04 Team Activity)
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', processEditProjectForm);

// Rutas de categorías
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

export default router;