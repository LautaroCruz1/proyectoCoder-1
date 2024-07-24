import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../../../data/productos.json');

router.get('/', (req, res) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ msg: 'Error al leer los productos' });
        }
        const products = JSON.parse(data);
        res.render('home', { products });
    });
});

router.get('/realtimeproducts', (req, res) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ msg: 'Error al leer los productos' });
        }
        const products = JSON.parse(data);
        res.render('realTimeProducts', { products });
    });
});

export default router;

