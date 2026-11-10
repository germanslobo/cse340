// src/routes.js
import express from 'express';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';

const router = express.Router();

// Definir las rutas
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

export default router;