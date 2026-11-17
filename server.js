// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './src/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configurar EJS y la ruta absoluta exacta de las vistas apuntando a la raíz del proyecto
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Usar el enrutador centralizado para todas las rutas
app.use('/', router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});