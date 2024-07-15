const express = require("express");
const bodyParser = require("body-parser");
const cartsRouter = require("./api/carts/carts.router.js"); // conexión a la ruta carrito
const productsRouter = require("./api/products/products.router.js"); // conexión a la ruta products

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
