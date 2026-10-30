import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' folder (CSS, images, etc.)
app.use(express.static('public'));

// Routes using arrow functions and async/await
app.get('/', async (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/organizations', async (req, res) => {
    res.render('organizations', { title: 'Organizations' });
});

app.get('/projects', async (req, res) => {
    res.render('projects', { title: 'Service Projects' });
});

app.get('/categories', async (req, res) => {
    res.render('categories', { title: 'Service Project Categories' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});