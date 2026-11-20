import express from 'express';
import { showHomePage } from './controllers/mainController.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizationsController.js';
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
} from './controllers/categoriesController.js';

const router = express.Router();

// Ruta principal
router.get('/', showHomePage);

// Rutas de organizaciones
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Rutas para crear y editar organizaciones (W04 Assignment)
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', processNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', processEditOrganizationForm);

// Rutas de proyectos de servicio
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Rutas para crear y editar proyectos de servicio (W04 Assignment / Team Activity)
router.get('/new-project', showNewProjectForm);
router.post('/new-project', processNewProjectForm);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', processEditProjectForm);

// Rutas para asignar categorías a un proyecto de servicio (W04 Assignment)
router.get('/project/:id/categories', showAssignCategoriesForm);
router.post('/project/:id/categories', processAssignCategoriesForm);

// Rutas de categorías
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Rutas para crear y editar categorías (W04 Assignment)
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', processNewCategoryForm);
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', processEditCategoryForm);

export default router;