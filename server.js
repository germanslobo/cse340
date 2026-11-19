// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './src/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configurar EJS apuntando a la carpeta views en la raíz del proyecto
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos desde la carpeta public en la raíz
app.use(express.static(path.join(__dirname, 'public')));

// Usar el enrutador centralizado para todas las rutas
app.use('/', router);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found',
        currentYear: new Date().getFullYear()
    });
});

// Manejo centralizado de errores (500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', {
        title: 'Internal Server Error',
        currentYear: new Date().getFullYear()
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});