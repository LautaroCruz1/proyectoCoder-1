import express from 'express';
import bodyParser from 'body-parser';
import cartsRouter from './api/src/routes/carts/carts.router.js';
import productsRouter from './api/src/routes/products/products.router.js';

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Uso de rutas
app.use('/', productsRouter);
app.use('/', cartsRouter);



app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});
