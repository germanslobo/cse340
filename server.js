import express from 'express';
import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';

const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (CSS, images) from the public folder
app.use(express.static('public'));

// Home Route
app.get('/', async (req, res) => {
    res.render('index', { 
        title: 'Home', 
        currentYear: new Date().getFullYear() 
    });
});

// Organizations Route
app.get('/organizations', async (req, res) => {
    res.render('organizations', { 
        title: 'Organizations', 
        currentYear: new Date().getFullYear() 
    });
});

// Service Projects Route
app.get('/projects', async (req, res) => {
    try {
        const projects = await getAllProjects();
        res.render('projects', { 
            title: 'Service Projects', 
            currentYear: new Date().getFullYear(),
            projects
        });
    } catch (error) {
        console.error('Error al cargar los proyectos:', error);
        res.status(500).send('Error interno del servidor al cargar los proyectos.');
    }
});

// Service Project Categories Route (Actualizada)
app.get('/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { 
            title: 'Service Project Categories', 
            currentYear: new Date().getFullYear(),
            categories // Pasamos las categorías obtenidas de la base de datos a la vista
        });
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
        res.status(500).send('Error interno del servidor al cargar las categorías.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});