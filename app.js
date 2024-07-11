const { urlencoded } = require("body-parser")
const express = require("express")
const cartsRouter = require("./api/carts/carts.router.js")
const productsRouter = require("./api/products/products.router.js")
const app = express()
const PORT = 8080

app.use(express.json())
app.use(urlencoded({ extended: true }))

app.use("/", cartsRouter) 
app.use("/", productsRouter) 

app.listen(PORT, ()=>{
    console.log(`Server running on PORT: ${PORT} `);
})