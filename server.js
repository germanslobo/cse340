// server.js
import express from 'express';
import { getAllCategories } from './src/models/categories.js';
import router from './src/routes.js'; // 1. Importar el archivo de rutas modular

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

// Service Project Categories Route
app.get('/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { 
            title: 'Service Project Categories', 
            currentYear: new Date().getFullYear(),
            categories 
        });
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
        res.status(500).send('Error interno del servidor al cargar las categorías.');
    }
});

// 2. Usar el enrutador modular para /projects y /project/:id
app.use(router);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});