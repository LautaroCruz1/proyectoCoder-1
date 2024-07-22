import { error } from 'console';
import express from 'express';
import fs from 'fs';

const router = express.Router();
const filePath = './api/data/carrito.json';  //filePath para simplificar código


// Ruta para crear un nuevo carrito
router.post('/carts', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        let carritoArray = JSON.parse(data); 
        if (!Array.isArray(carritoArray)) {
            carritoArray = [];
        }
        const newCart = {
            id: (carritoArray.length + 1).toString(), //con éste código generamos un id único para luego identificar cada cart por su Id
            products: []
        };
        carritoArray.push(newCart);
        fs.writeFile(filePath, JSON.stringify(carritoArray, null, 2), err => { //escribimos todo el archivo sobre carrito.json utilizando FS
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });//en caso de error, mostramos por consola y avisamos mediante postman
            }
            res.status(201).json(newCart);
        });
    });
});


// Ruta para obtener un carrito por su ID
router.get('/carts/:cid', (req, res) => {
    const cartId = req.params.cid;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const carritoArray = JSON.parse(data);
        const cart = carritoArray.find(cart => cart.id === cartId); //buscamos cart id dentro de carrito.json, en caso de existir, se muestra en postman
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
    });
});


// Ruta para agregar un producto a un carrito
router.post('/carts/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid; //parametro1
    const productId = req.params.pid; //parametro2
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const carritoArray = JSON.parse(data);
        const carritoIndex = carritoArray.findIndex(cart => cart.id === cartId); //utilizamos este pequeño bloque para verificar el index del Id
        if (carritoIndex !== -1) {
            const carrito = carritoArray[carritoIndex];
            const productIndex = carrito.products.findIndex(p => p.product === productId);
            if (productIndex !== -1) {
                carrito.products[productIndex].quantity += 1;   //en caso que sea distinto a -1, se incrementará de 1 en 1 la cantidad
            } else {
                carrito.products.push({ product: productId, quantity: 1 }); //en caso de no existir, se crea un nuevo objeto con el id del producto, y su cantidad, esto permitirá incrementar la cantidad de cada producto en caso de que exista
            }
            fs.writeFile(filePath, JSON.stringify(carritoArray, null, 2), err => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.status(200).json({ message: 'Product added to cart successfully' });
            });
        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
    });
});
export default router;
