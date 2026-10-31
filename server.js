import express from 'express';

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
    res.render('projects', { 
        title: 'Service Projects', 
        currentYear: new Date().getFullYear() 
    });
});

// Service Project Categories Route
app.get('/categories', async (req, res) => {
    res.render('categories', { 
        title: 'Service Project Categories', 
        currentYear: new Date().getFullYear() 
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});