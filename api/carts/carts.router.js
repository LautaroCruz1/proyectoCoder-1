const express = require("express")
const router = express.Router()

router.post("/", (req, res) => { //debera crear un nuevo carrito con id: (string o number) y products (array de los productos)
    
})


router.get("/:cid", (req, res) => { //deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.

    
})

router.post("/:cid/product/:pid ", (req, res) => { 


    // deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato
    // - product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
    // - quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
    // Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 
    
})



module.exports = router