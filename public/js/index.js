const socket = io();

        // Bienvenida
        Swal.fire({
            title: "App cargada correctamente",
            text: "Bienvenido usuario",
            icon: "success"
        });

        // Alerta y actualización de la lista cuando se añade un producto
        socket.on('productAdded', (product) => {
            Swal.fire({
                title: 'Producto añadido',
                text: `El producto ${product.title} ha sido añadido correctamente`,
                icon: 'success'
            });

            const productList = document.getElementById('product-list');
            const newProduct = document.createElement('li');
            newProduct.className = 'list-item';
            newProduct.setAttribute('data-id', product.id);
            newProduct.textContent = `${product.title}: $${product.price}`;
            productList.appendChild(newProduct);
        });

        // Alerta y actualización de la lista cuando se elimina un producto
        socket.on('productDeleted', (productId) => {
            Swal.fire({
                title: 'Producto eliminado',
                text: `El producto con ID ${productId} ha sido eliminado`,
                icon: 'success'
            });

            const productList = document.getElementById('product-list');
            const productItems = productList.getElementsByClassName('list-item');
            for (let i = 0; i < productItems.length; i++) {
                if (productItems[i].getAttribute('data-id') == productId) {
                    productList.removeChild(productItems[i]);
                    break;
                }
            }
        });

        // Actualización completa de la lista de productos
        socket.on('updateProducts', (products) => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = '';
            products.forEach(product => {
                const li = document.createElement('li');
                li.className = 'list-item';
                li.setAttribute('data-id', product.id);
                li.textContent = `${product.title}: $${product.price}`;
                productList.appendChild(li);
            });
        });

        // Manejo del formulario para agregar productos
        const addProductForm = document.getElementById('add-product-form');
        addProductForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const title = document.getElementById('title').value;
            const price = document.getElementById('price').value;
            const description = document.getElementById('description').value;
            const code = document.getElementById('code').value;
            const stock = document.getElementById('stock').value;
            const category = document.getElementById('category').value;

            socket.emit('addProduct', {
                title,
                price,
                description,
                code,
                stock,
                category
            });
        });

        // Manejo del formulario para eliminar productos
        const deleteProductForm = document.getElementById('delete-product-form');
        deleteProductForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const productId = document.getElementById('product-id').value;
            socket.emit('deleteProduct', productId);
        });