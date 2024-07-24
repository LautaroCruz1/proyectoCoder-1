import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../../../data/productos.json'); // Asegúrate de que la ruta sea correcta

const productRouter = (io) => {
    router.get('/', (req, res) => {
        fs.readFile(filePath, 'utf-8', (error, data) => {
            if (error) {
                res.status(500).json({ msg: "Error interno del servidor" });
                return;
            }
            let products = JSON.parse(data);
            let limit = parseInt(req.query.limit) || products.length;
            products = products.slice(0, limit);
            res.json(products);
        });
    });

    router.get('/:pid', (req, res) => {
        const productId = req.params.pid;
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Error interno del servidor" });
            }
            const productArray = JSON.parse(data);
            const product = productArray.find(product => product.id === parseInt(productId));
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        });
    });

    router.post('/', (req, res) => {
        const { title, description, code, price, status, stock, category } = req.body;
        if (!title || !description || !code || price === undefined || stock === undefined || !category) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Error interno del servidor" });
            }
            const products = JSON.parse(data);
            const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
            const newProduct = { id, title, description, code, price, status: true, stock, category };
            products.push(newProduct);

            fs.writeFile(filePath, JSON.stringify(products, null, 2), error => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ msg: "Error al escribir en el archivo" });
                }
                io.emit('updateProducts', products);
                res.json(newProduct);
            });
        });
    });

    router.put('/:pid', (req, res) => {
        const { title, description, code, price, status, stock, category } = req.body;
        const productId = parseInt(req.params.pid);

        fs.readFile(filePath, 'utf-8', (error, data) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Error interno del servidor" });
            }
            let products = JSON.parse(data);
            let product = products.find(product => product.id === productId);

            if (product) {
                product.title = title || product.title;
                product.description = description || product.description;
                product.code = code || product.code;
                product.price = price || product.price;
                product.status = status !== undefined ? status : product.status;
                product.stock = stock !== undefined ? stock : product.stock;
                product.category = category || product.category;

                fs.writeFile(filePath, JSON.stringify(products, null, 2), error => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ error: "Error al escribir en el archivo" });
                    }
                    io.emit('updateProducts', products);
                    res.json(product);
                });
            } else {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
        });
    });

    router.delete('/:pid', (req, res) => {
        const productId = parseInt(req.params.pid);
        fs.readFile(filePath, 'utf-8', (error, data) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Error interno del servidor" });
            }
            let products = JSON.parse(data);
            if (!Array.isArray(products)) {
                return res.status(500).json({ error: "Los datos del archivo no son válidos" });
            }
            const productExists = products.some(product => product && product.id === productId);
            if (productExists) {
                const filteredProducts = products.filter(product => product && product.id !== productId);
                fs.writeFile(filePath, JSON.stringify(filteredProducts, null, 2), error => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ error: "Error al escribir en el archivo" });
                    }
                    io.emit('updateProducts', filteredProducts);
                    res.json({ message: "Producto eliminado exitosamente" });
                });
            } else {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
        });
    });

    

    return router;
};

export default productRouter;
