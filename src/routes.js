import express from 'express';
import { showHomePage } from './controllers/mainController.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizationsController.js';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categoriesController.js';

const router = express.Router();

// Ruta Principal
router.get('/', showHomePage);

// Rutas de Proyectos
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Rutas de Organizaciones
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Rutas de Categorías
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

export default router;