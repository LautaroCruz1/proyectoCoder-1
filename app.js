import express from 'express';
import bodyParser from 'body-parser';
import handlebars from 'express-handlebars';
import viewsRouter from './api/src/routes/views/views.router.js';
import cartsRouter from './api/src/routes/carts/carts.router.js';
import productRouter from './api/src/routes/products/products.router.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Server } from 'socket.io';
import fs from 'fs';

// Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;
const filePath = path.join(__dirname, 'api/data/productos.json');

// Handlebars setup
app.engine('handlebars', handlebars.engine({
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    defaultLayout: 'main',
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const io = new Server(httpServer);

// Routes
app.use('/', viewsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/products', productRouter(io));

// WebSocket connection
io.on('connection', (socket) => {
    console.log("Cliente conectado");

    socket.on('message', (data) => {
        console.log(`Data from client: ${data}`);
    });

    // Manejo de eventos de agregar producto
    socket.on('addProduct', (product) => {
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) {
                console.error(error);
                socket.emit('error', { message: 'Error interno del servidor' });
                return;
            }
            const products = JSON.parse(data);
            const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
            const newProduct = { id, ...product };

            products.push(newProduct);
            fs.writeFile(filePath, JSON.stringify(products, null, 2), (error) => {
                if (error) {
                    console.error(error);
                    socket.emit('error', { message: 'Error al escribir el archivo' });
                    return;
                }
                io.emit('productAdded', newProduct);
            });
        });
    });

    // Manejo de eventos de eliminar producto
    socket.on('deleteProduct', (productId) => {
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) {
                console.error(error);
                socket.emit('error', { message: 'Error interno del servidor' });
                return;
            }
            let products = JSON.parse(data);
            const productExists = products.some(p => p.id === parseInt(productId));

            if (productExists) {
                products = products.filter(p => p.id !== parseInt(productId));
                fs.writeFile(filePath, JSON.stringify(products, null, 2), (error) => {
                    if (error) {
                        console.error(error);
                        socket.emit('error', { message: 'Error al escribir el archivo' });
                        return;
                    }
                    io.emit('productDeleted', productId);
                });
            } else {
                socket.emit('error', { message: 'Producto no encontrado' });
            }
        });
    });
});
