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
import {
    organizationValidationRules,
    categoryValidationRules,
    projectValidationRules
} from './middleware/validators.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/register', showRegister);
router.post('/register', register);
router.get('/login', showLogin);
router.post('/login', login);
router.get('/logout', logout);
router.post('/logout', logout);

router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireLogin, requireRole('admin'), showUsers);

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/new-organization', requireLogin, requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireLogin, requireRole('admin'), organizationValidationRules, processNewOrganizationForm);
router.get('/edit-organization/:id', requireLogin, requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireLogin, requireRole('admin'), organizationValidationRules, processEditOrganizationForm);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get('/project/:id/volunteer', requireLogin, volunteerForProject);
router.post('/project/:id/volunteer', requireLogin, volunteerForProject);
router.get('/project/:id/unvolunteer', requireLogin, removeVolunteerFromProject);
router.post('/project/:id/unvolunteer', requireLogin, removeVolunteerFromProject);

router.get('/new-project', requireLogin, requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireLogin, requireRole('admin'), projectValidationRules, processNewProjectForm);
router.get('/edit-project/:id', requireLogin, requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireLogin, requireRole('admin'), projectValidationRules, processEditProjectForm);

router.get('/project/:id/categories', requireLogin, requireRole('admin'), showAssignCategoriesForm);
router.post('/project/:id/categories', requireLogin, requireRole('admin'), processAssignCategoriesForm);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

router.get('/new-category', requireLogin, requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireLogin, requireRole('admin'), categoryValidationRules, processNewCategoryForm);
router.get('/edit-category/:id', requireLogin, requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireLogin, requireRole('admin'), categoryValidationRules, processEditCategoryForm);

export default router;