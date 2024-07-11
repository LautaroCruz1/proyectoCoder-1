const express = require("express")
const router = express.Router()

const products = [
    {id:Number},
    {title : String},
    {description: String},
    {code: String},
    {price:Number},
    {status:Boolean},
    {stock:number},
    {category:string},
    // {thumbnails}
]

router.get("/api/products/", (req, res) => {   //get para traer todos los productos del cart
    
})

router.get("/api/products/:pid", (req, res) => {   //este get debe traer solo los productos del cart por id
    
})

router.post("/", (req, res) => {   //debera agregar un nuevo producto al cart mediante el uso de arrays y .push
    
})

router.put("/:pid", (req, res) => { //deberá tomar un producto y actualizarlo por los campos enviados desde body. 
                                    //NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.
    
})

router.delete("/:pid", (req,res) => {  //debera eliminar el producto del carrito utilizando el numero de id indicado

})


module.exports = router
