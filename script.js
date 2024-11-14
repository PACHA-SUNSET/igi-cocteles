document.addEventListener('DOMContentLoaded', () => {
    const messageEl = document.getElementById('message');
    const registerModal = document.getElementById('registerModal');
    const carousels = document.querySelectorAll('.carousel');
    const sidebar = document.getElementById('sidebar');
    const icon = document.getElementById('icon');
    const productModal = document.getElementById('productModal');
    const productMessage = document.getElementById('productMessage');
    const closeProductModal = document.getElementById('closeProductModal');
    const quantityControls = document.getElementById('quantityControls');
    const quantitySpan = document.getElementById('quantity');
    let currentQuantity = 0;
    let selectedProductName = "";
    let cartItems = [];
    // Agregar el evento para el botón "Cancelar"
    closeProductModal.addEventListener('click', () => {
        productModal.style.display = 'none'; // Oculta el modal
    });

    // Cargar el carrito desde localStorage
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
        cartItems = JSON.parse(savedCartItems);
    }

    // Ocultar los carruseles inicialmente
    carousels.forEach(carousel => {
        carousel.style.display = 'none';
    });

    document.getElementById('chooseName').addEventListener('click', function () {
        const selectedName = document.getElementById('nameSelect').value;
        const nameMessage = document.getElementById('nameMessage');
        const checkMark = document.getElementById('checkMark');
        const chooseButton = document.getElementById('chooseName'); // Botón "Aceptar"

        // Mostrar mensaje de error si no se selecciona un nombre
        if (!selectedName) {
            nameMessage.textContent = 'Por favor, selecciona un nombre.';
            return; // Salir de la función
        }

        // Hacer el botón invisible y mostrar el check animado
        chooseButton.style.visibility = 'hidden'; // Hace el botón invisible
        checkMark.style.display = 'block';

        // Esperar 1 segundo antes de ocultar el check y decidir qué hacer
        setTimeout(() => {
            checkMark.style.display = 'none'; // Ocultar el check
            chooseButton.style.visibility = 'visible'; // Hacer nuevamente visible el botón

            if (selectedName === "Rosario Zabala") {
                // Ocultar el modal de selección
                document.getElementById('nameModal').style.display = 'none';
                // Mostrar los carruseles
                carousels.forEach(carousel => {
                    carousel.style.display = 'flex';
                });
            } else {
                // Para otros nombres, ocultar el modal de selección y mostrar el de huella
                document.getElementById('nameModal').style.display = 'none';
                registerModal.style.display = 'flex';
            }
        }, 1000); // Duración del check animado
    });

    // Registrar huella digital
    document.getElementById('register').addEventListener('click', async () => {
        try {
            const publicKey = {
                challenge: new Uint8Array(32),
                rp: { name: "Tu Sitio Web" },
                user: {
                    id: new Uint8Array(16),
                    name: "usuario@example.com",
                    displayName: "Usuario"
                },
                pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                authenticatorSelection: { authenticatorAttachment: "platform" },
                timeout: 60000,
                attestation: "direct"
            };

            const credential = await navigator.credentials.create({ publicKey });
            console.log(credential);
            messageEl.textContent = "Huella registrada con éxito.";

            registerModal.style.display = 'none';
            carousels.forEach(carousel => {
                carousel.style.display = 'flex';
            });
        } catch (err) {
            console.error(err);
            messageEl.textContent = "Error al registrar huella.";
        }
    });

    // Mostrar el menú lateral
    icon.addEventListener('click', () => {
        sidebar.style.left = '0'; 
    });

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', (event) => {
        if (!sidebar.contains(event.target) && event.target !== icon) {
            sidebar.style.left = '-250px'; 
        }
    });

    sidebar.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            event.stopPropagation(); 
        }
    });

    const productNamesArray = [
        ["Monster Sin Azucar"],
        ["Monster Energy"],
        ["Jägermeister", "Combo Jägermeister"],
        ["CoCacola 2l"],
        ["Huari Origen", "Huari Miel"],
        ["Corona"],
        ["Havana Club Reserva", "Combo Reserva"],
        ["Fernet Branca", "Combo Fernet Branca"],
        ["Viuda Descalza", "Combo Viuda Descalza"],
        ["Gin la Republica", "Combo Gin la Republica"],
        ["Vodka 1825", "Combo Vodka 1825"],
        ["Singani Los Parrales", "Combo Singani Los Parrales"],
        ["Mambo Manzana"],
        ["Mambo Botanica"],
        ["Mambo Uva"],
        ["Mambo Lima Limon"],
        ["Gingerel Ale"],
        ["Agua Pacha Purificada"],
        ["Sprite 2L"],
        ["Agua Vital 2L"],
        ["Pomelo 2L"],
        ["Agua Tónica"],
        ["Havana Club Especial", "Combo Havana Club Especial"],
    ];


    const bottles = document.querySelectorAll('.bottle');
    bottles.forEach((bottle, index) => {
        bottle.addEventListener('click', () => {
            const productNames = productNamesArray[index] || [];
            productMessage.innerHTML = `<strong>Producto:</strong><br>`; 

            productNames.forEach((productName) => {
                productMessage.innerHTML += `<button class="select-product">${productName}</button>`;
            });

            productModal.style.display = 'flex';
            quantityControls.style.display = 'none'; 
            currentQuantity = 0; 
            quantitySpan.textContent = currentQuantity; 

            document.querySelectorAll('.select-product').forEach(button => {
                button.addEventListener('click', () => {
                    selectedProductName = button.innerText; 
                    productMessage.innerHTML = `<strong>Producto:</strong><br>${selectedProductName}`; 
                    quantityControls.style.display = 'flex'; 
                });
            });
        });
    });

    // Controlar la cantidad
    document.getElementById('increaseQuantity').addEventListener('click', () => {
        currentQuantity++;
        quantitySpan.textContent = currentQuantity;
    });

    document.getElementById('decreaseQuantity').addEventListener('click', () => {
        if (currentQuantity > 0) {
            currentQuantity--;
            quantitySpan.textContent = currentQuantity;
        }
    });

    document.getElementById('addToCart').addEventListener('click', () => {
        const checkMark = document.getElementById('checkMark');
        const userName = document.getElementById('nameSelect').value;
        const quantity = currentQuantity;

        // Muestra el check y oculta el botón
        checkMark.style.display = 'block'; // Muestra el check
        document.getElementById('addToCart').style.visibility = 'hidden'; // Oculta el botón

        // Crear y mostrar el mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message position-right'; // Añade la clase para estilos y posición
        messageDiv.innerText = '✔️';

        document.body.appendChild(messageDiv);

        // Oculta el mensaje después de 2 segundos
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 1000); // 1000 ms = 1 segundo

        // Espera 1 segundo antes de ocultar el check y cerrar el modal
        setTimeout(() => {
            checkMark.style.display = 'none'; // Oculta el check
            document.getElementById('addToCart').style.visibility = 'visible'; // Muestra el botón nuevamente

            // Agrega el producto al carrito
            const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/La_Paz' };
            const dateFormatter = new Intl.DateTimeFormat('es-BO', options);

            const currentDate = dateFormatter.format(new Date()).split('/').reverse().join('-'); // Cambiar a formato YYYY-MM-DD
            const currentTime = new Date().toLocaleString('es-BO', { timeZone: 'America/La_Paz', hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const [hour, minute, second] = currentTime.split(':');
            // Formatear con espacios
            const formattedTime = `${hour} : ${minute} : ${second}`;
            cartItems.push({
                userName: userName,
                productName: selectedProductName,
                quantity: quantity,
                date: currentDate,

                time: formattedTime // Aquí estás usando formattedTime
            });


            localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Guardar en localStorage
            productModal.style.display = 'none'; // Cierra el modal
        }, 1000); // Duración del check visible
    });

    document.getElementById('cartIcon').addEventListener('click', () => {
        const renderCartDetails = (items) => `
            <table class="table-cart">
                <tr>
                    <th>Nombre</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                </tr>
                ${items.length > 0 ? items.map(item => `
                    <tr>
                        <td>${item.userName}</td>
                        <td>${item.productName}</td>
                        <td>${item.quantity}</td>
                        <td>${item.date}</td>
                        <td>${item.time}</td>
                    </tr>
                `).join('') : '<tr><td colspan="5" style="text-align:center;">No hay productos en el carrito.</td></tr>'}
            </table>
        `;

        const cartModal = document.createElement('div');
        cartModal.className = 'cart-modal';
        cartModal.innerHTML = `
            <h2>Productos Añadidos</h2>
            <div>
                <input type="date" id="searchDate" placeholder="Buscar por fecha">
                <img id="searchButton" src="https://img.icons8.com/?size=100&id=vh31KMqhxPJn&format=png&color=000000" style="cursor: pointer; width: 32px; height: 32px;">

            </div>
            ${renderCartDetails(cartItems)}
            <button class="close-cart-modal">Cerrar</button>
        `;

        document.body.appendChild(cartModal);

        const searchButton = document.getElementById('searchButton');
        const searchDateInput = document.getElementById('searchDate');

        const updateCartModal = (filteredItems) => {
            cartModal.innerHTML = `
                <h2>Productos Añadidos</h2>
                <div>
                    <input type="date" id="searchDate" placeholder="Buscar por fecha" value="${searchDateInput.value}">
                    <img id="searchButton" src="https://img.icons8.com/?size=100&id=vh31KMqhxPJn&format=png&color=000000" style="cursor: pointer; width: 31px; height: 31px;">
                </div>
                ${renderCartDetails(filteredItems)}
                <button class="close-cart-modal">Cerrar</button>
            `;

            // Re-attach the close button event listener
            cartModal.querySelector('.close-cart-modal').addEventListener('click', () => {
                document.body.removeChild(cartModal);
            });

            // Re-attach the search button event listener
            const newSearchButton = cartModal.querySelector('#searchButton');
            const newSearchDateInput = cartModal.querySelector('#searchDate');

            newSearchButton.addEventListener('click', () => {
                const searchDate = newSearchDateInput.value;
                const filteredItems = cartItems.filter(item => item.date === searchDate);
                updateCartModal(filteredItems);
            });
        };

        // Modificar el evento de búsqueda
        searchButton.addEventListener('click', () => {
            const searchDate = searchDateInput.value;
            const filteredItems = cartItems.filter(item => item.date === searchDate);
            updateCartModal(filteredItems);
        });

        cartModal.querySelector('.close-cart-modal').addEventListener('click', () => {
            document.body.removeChild(cartModal);
        });
    });

    document.getElementById('finalizeButton').addEventListener('click', (event) => {
        event.preventDefault();
        sidebar.style.left = '-250px'; 
        carousels.forEach(carousel => {
            carousel.style.display = 'none'; 
        });

        messageEl.textContent = ''; 
        const nameMessage = document.getElementById('nameMessage');
        nameMessage.textContent = ''; 

        const nameSelect = document.getElementById('nameSelect');
        nameSelect.selectedIndex = 0; 
        document.getElementById('nameModal').style.display = 'flex'; 
    });

    document.getElementById('clearCartButton').addEventListener('click', () => {
        cartItems = []; 
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); 
        alert('Carrito borrado'); 
    });

    // Evitar el zoom en dispositivos táctiles
    document.addEventListener('gesturestart', (event) => {
        event.preventDefault();
    });

    // Deshabilitar el desplazamiento táctil
    document.addEventListener('touchmove', (event) => {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });   
});
