const { error } = require("console")
const express = require("express")
const router = express.Router()
const fs = require("fs")

const filePath = "./data/productos.json"



//Ruta traer todos los productos del cart (y con limite ?limit= x) 
router.get("/", (req, res) => { 
    fs.readFile(filePath, "utf-8", (error, data) => {
        if (error) {
            res.status(500).json({ msg: "Error interno del servidor" })
            return;

        } else {
            let products = JSON.parse(data)
            let limit = parseInt(req.query.limit) || products.length
            products = products.slice(0, limit); //limite = 0, usamos  localhost:8080/?limit=<numero> para "filtrar" la cantidad de productos    
            res.json(products)
        }
    })
})


//Ruta para obtener los productos por su Id
router.get("/products/:pid", (req, res) => {
    const productId = req.params.pid;
    fs.readFile(filePath, 'utf8', (error, data) => {  //ruta a productos.json (filePath de la linea 5)
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
        const productArray = JSON.parse(data);
        const product = productArray.find(product => product.id === parseInt(productId));
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    });
});

//Ruta para postear nuevos productos (utilizando body>raw)
router.post("/products", (req, res) => {
    const {
        title,
        description,
        code,
        price,
        status, 
        stock,
        category
    } = req.body
    fs.readFile(filePath, 'utf8', (error, data) => {  //ruta a productos.json (filePath de la linea 5)
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
        const products = JSON.parse(data)
        const Id = products.length += 1 
        const añadirProducto = {
            Id,
            title: "producto nuevo posteado",
            description: "descripción nuevo posteada",
            code: "posteo del codigo del nuevo producto",
            price: 250,
            status : true,
            stock: 1,
            category: "producto posteado"
        }
        products.push(añadirProducto)
    
        fs.writeFile(filePath, JSON.stringify(products, null, 2), error => {
            if (error) {
                console.error(error)
                return res.status(404).json({ msg: "error 404 not found" })
            }
            res.json(añadirProducto)
        })
    })
})

//Ruta para modificar los productos 
router.put("/:pid", (req, res) => {
    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category
    } = req.body;
    
    const productoId = parseInt(req.params.pid);

    fs.readFile(filePath, "utf-8", (error, data) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        let productoArray = JSON.parse(data);
        let producto = productoArray.find(productoArray => productoArray.id === productoId);

        if (producto) {
            producto.title = title || producto.title;
            producto.description = description || producto.description;
            producto.code = code || producto.code;
            producto.price = price || producto.price;
            producto.status = status || producto.status;
            producto.stock = stock || producto.stock;
            producto.category = category || producto.category;

            fs.writeFile(filePath, JSON.stringify(productoArray, null, 2), error => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: "Error al escribir el archivo" });
                }
                res.json(producto);
            });
        } else {
            return res.status(404).json({ error: "error 404 not found" });
        }
    });
});

//Ruta para eliminar productos mediante su Id
router.delete("/:pid", (req, res) => {
    const productoId = parseInt(req.params.pid);
    fs.readFile(filePath, "utf-8", (error, data) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
        let productoArray = JSON.parse(data);
        if (!Array.isArray(productoArray)) {
            return res.status(500).json({ error: "Los datos del archivo no son válidos" });
        }
        const productoExistente = productoArray.some(p => p && p.id === productoId);
        if (productoExistente) {
            const productoArrayFiltrado = productoArray.filter(p => p && p.id !== productoId);
            fs.writeFile(filePath, JSON.stringify(productoArrayFiltrado, null, 2), error => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: "Error al escribir el archivo" });
                }
                res.json({ message: "Producto eliminado exitosamente" });
            });
        } else {
            return res.status(404).json({ error: "error 404 not found" });
        }
    });
});

module.exports = router
