// src/routes.js
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
    processAssignCategoriesForm,
    volunteerForProject,
    removeVolunteerFromProject
} from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
} from './controllers/categoriesController.js';
import {
    showRegister,
    register,
    showLogin,
    login,
    logout,
    showDashboard,
    showUsers
} from './controllers/authController.js';
import { requireLogin, requireRole } from './middleware/auth.js';

const router = express.Router();

// Ruta principal
router.get('/', showHomePage);

// Rutas de autenticación (W05 Assignment)
router.get('/register', showRegister);
router.post('/register', register);
router.get('/login', showLogin);
router.post('/login', login);
router.get('/logout', logout);
router.post('/logout', logout);

// Rutas de dashboard y administración de usuarios (W05 Assignment)
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireLogin, requireRole('admin'), showUsers);

// Rutas de organizaciones
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Rutas para crear y editar organizaciones (W04 Assignment / W05 Protected Access)
router.get('/new-organization', requireLogin, requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireLogin, requireRole('admin'), processNewOrganizationForm);
router.get('/edit-organization/:id', requireLogin, requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireLogin, requireRole('admin'), processEditOrganizationForm);

// Rutas de proyectos de servicio
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Rutas para voluntariado en proyectos (W06 Assignment - Protected by requireLogin)
router.get('/project/:id/volunteer', requireLogin, volunteerForProject);
router.post('/project/:id/volunteer', requireLogin, volunteerForProject);
router.get('/project/:id/unvolunteer', requireLogin, removeVolunteerFromProject);
router.post('/project/:id/unvolunteer', requireLogin, removeVolunteerFromProject);

// Rutas para crear y editar proyectos de servicio (W04 Assignment / Team Activity / W05 Protected Access)
router.get('/new-project', requireLogin, requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireLogin, requireRole('admin'), processNewProjectForm);
router.get('/edit-project/:id', requireLogin, requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireLogin, requireRole('admin'), processEditProjectForm);

// Rutas para asignar categorías a un proyecto de servicio (W04 Assignment / W05 Protected Access)
router.get('/project/:id/categories', requireLogin, requireRole('admin'), showAssignCategoriesForm);
router.post('/project/:id/categories', requireLogin, requireRole('admin'), processAssignCategoriesForm);

// Rutas de categorías
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Rutas para crear y editar categorías (W04 Assignment / W05 Protected Access)
router.get('/new-category', requireLogin, requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireLogin, requireRole('admin'), processNewCategoryForm);
router.get('/edit-category/:id', requireLogin, requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireLogin, requireRole('admin'), processEditCategoryForm);

export default router;