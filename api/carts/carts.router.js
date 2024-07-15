const express = require("express")
const router = express.Router()

// router.post("/:cid/products/:pid", (req, res) => {   //debera agregar un nuevo producto AL CARRITO mediante el uso de arrays y .push
//     const cartId = req.params.cid;
//     const productoId = req.params.pid;
//     const productoAñadido = {
//         product: productoId,
//         quantity: 1
//     }
//     //leer el archivo usando fs
//     fs.readFile(filePath, 'utf8', (error, data) => {
//         if (error) {
//             console.error(error)
//             return res.status(404).json({ msg: "error interno del servidor" })
//         }
    
//     const carritos = JSON.parse(data);
//     const lecturaCarrito = carritos.findIndex(carritos => carritos.id === cartId)
//     if (lecturaCarrito !== -1) {
//         carritos[carritosIndex].products.push(productoAñadido)
    
//     fs.writeFile(filePath, JSON.stringify(carritos, null, 2), error => {
//         if (error) {
//             console.error(error)
//             return res.send(404).json({ msg: "error al escribir products.json" })
//         }
//         res.status(202).json({ msg: "producto añadido al carrito correctamente" })
//     });
//     } else{
//         res.status(404).json({ error: 'carrito no encontrado' });
//     }
// })
// })



router.get("/:cid", (req, res) => { //deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.

    
})

router.post("/:cid/product/:pid ", (req, res) => { 


    // deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato
    // - product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
    // - quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
    // Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 
    
})



module.exports = router