import express from 'express';
import bodyParser from 'body-parser';
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import viewsRouter from './api/src/routes/views/views.router.js';
import cartsRouter from './api/src/routes/carts/carts.router.js';
import productRouter from './api/src/routes/products/products.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

const hbs = handlebars.create({
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    defaultLayout: 'main',
});

app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const io = new Server(httpServer);

app.use('/', viewsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/products', productRouter(io));

io.on('connection', socket => {
    console.log("Cliente conectado");

    socket.on('message', data => {
        console.log(`Data del cliente: ${data}`);
    });
});

export default io;
