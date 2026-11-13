// src/routes.js
import express from 'express';
import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showCategoryDetailsPage 
} from './controllers/projects.js';

const router = express.Router();

// Definir las rutas
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);

export default router;