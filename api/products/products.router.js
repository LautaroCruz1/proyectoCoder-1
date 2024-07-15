const { error } = require("console")
const express = require("express")
const router = express.Router()
const fs = require("fs")

const filePath = "./data/productos.json"


router.get("/", (req, res) => {   //get para traer todos los productos del cart y el limite ?limit= x 
    fs.readFile(filePath, "utf-8", (error, data) => {
        if (error) {
            res.status(500).json({ msg: "error al cargar productos" })
            return;

        } else {
            let products = JSON.parse(data)
            let limit = parseInt(req.query.limit) || products.length
            products = products.slice(0, limit); //limite = 0, usamos  localhost:8080/?limit=<numero> para "filtrar" la cantidad de productos    
            res.json(products)
        }
    })
})


// PROFE
router.get("/products/:pid", (req, res) => {
    const productId = req.params.pid;
    fs.readFile(filePath, 'utf8', (error, data) => {  //ruta a productos.json (filePath de la linea 5)
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "error interno del servidor" });
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
            return res.status(500).json({ error: "error interno del servidor" });
        }
        const products = JSON.parse(data)
        const nuevoId = products.length += 1 
        const añadirProducto = {
            nuevoId,
            title: "productoNuevo 5",
            description: "descripción nuevo producto 5",
            code: "codigo del nuevo producto",
            price: 250,
            status : true,
            stock: 1,
            category: "categoria de nuevo producto 5"
        }
        products.push(añadirProducto)
        //escritura del nuevo arreglo en productos.json
        fs.writeFile(filePath, JSON.stringify(products, null, 2), error => {
            if (error) {
                console.error(error)
                return res.status(404).json({ msg: "error 404 not found" })
            }
            res.json(añadirProducto)
        })
    })
})











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
            return res.status(500).json({ error: "error interno del servidor" });
        }

        let productoArray = JSON.parse(data);
        let producto = productoArray.find(p => p.id === productoId);

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
                    return res.status(500).json({ error: "error al escribir el archivo" });
                }
                res.json(producto);
            });
        } else {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
    });
});















router.delete("/:pid", (req, res) => {  //debera eliminar el producto del carrito utilizando el numero de id indicado

})


module.exports = router
