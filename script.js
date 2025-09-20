document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURACIÓN INICIAL ---
    const WHATSAPP_NUMBER = '5211234567890'; // <-- ¡IMPORTANTE! Cambia este número por el de tu negocio.
    
    // --- BASE DE DATOS DE PRODUCTOS ---
    const products = [
        {
            id: 1,
            name: 'Jabón Líquido para Trastes (500ml)',
            price: 25.00,
            image: 'https://placehold.co/300x300/e8e8e8/333?text=Jabón+Líquido',
            category: 'Hogar'
        },
        {
            id: 2,
            name: 'Detergente en Polvo (1kg)',
            price: 45.00,
            image: 'https://placehold.co/300x300/e8e8e8/333?text=Detergente',
            category: 'Hogar'
        },
        {
            id: 3,
            name: 'Limpiador Multiusos Aromático "Frescura Floral" (1L)',
            price: 30.00,
            image: 'https://placehold.co/300x300/e8e8e8/333?text=Limpiador',
            category: 'Hogar'
        },
        {
            id: 4,
            name: 'Limpiador de Pino Concentrado (1L)',
            price: 35.00,
            image: 'https://placehold.co/300x300/e8e8e8/333?text=Pino',
            category: 'Hogar'
        },
        {
            id: 5,
            name: 'Cloro Blanqueador (1L)',
            price: 20.00,
            image: 'https://placehold.co/300x300/e8e8e8/333?text=Cloro',
            category: 'Hogar'
        },
        {
            id: 6,
            name: 'Shampoo para Auto con Cera (1L)',
            price: 60.00,
            image: 'https://placehold.co/300x300/e8e8e8/333?text=Shampoo+Auto',
            category: 'Vehículos'
        },
        {
            id: 7,
            name: 'Abrillantador de Llantas "Negro Intenso" (500ml)',
            price: 55.00,
            image: 'https://placehold.co/300x300/e8e8e8/333?text=Abrillantador',
            category: 'Vehículos'
        },
        {
            id: 8,
            name: 'Shampoo Revitalizante (400ml)',
            price: 50.00,
            image: 'https://placehold.co/300x300/e8e8e8/333?text=Shampoo',
            category: 'Cuidado Corporal'
        },
        {
            id: 9,
            name: 'Jabón Líquido para Manos "Avena y Miel" (500ml)',
            price: 40.00,
            image: 'https://placehold.co/300x300/e8e8e8/333?text=Jabón+Manos',
            category: 'Cuidado Corporal'
        },
        {
            id: 10,
            name: 'Crema Corporal Hidratante (250ml)',
            price: 48.00,
            image: 'https://placehold.co/300x300/e8e8e8/333?text=Crema',
            category: 'Cuidado Corporal'
        },
        {
            id: 11,
            name: 'Escoba de Cerdas Rígidas',
            price: 70.00,
            image: 'https://placehold.co/300x300/e8e8e8/333?text=Escoba',
            category: 'Jarcería'
        },
        {
            id: 12,
            name: 'Mechudo de Microfibra Absorbente',
            price: 95.00,
            image: 'https://placehold.co/300x300/e8e8e8/333?text=Mechudo',
            category: 'Jarcería'
        }
    ];

    // --- VARIABLES Y SELECTORES DEL DOM ---
    let cart = [];
    const productCatalog = document.getElementById('product-catalog');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalElem = document.getElementById('cart-subtotal');
    const sendOrderBtn = document.getElementById('send-order-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const toast = document.getElementById('toast-notification');
    const mobileCartToggle = document.getElementById('mobile-cart-toggle');
    const mobileCartCount = document.getElementById('mobile-cart-count');
    const cartSection = document.getElementById('cart-section');
    const cartHeader = document.querySelector('.cart-header');


    // --- FUNCIONES ---

    /**
     * Dibuja los productos en el catálogo
     */
    function renderProducts() {
        productCatalog.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <i class="fa-solid fa-cart-plus"></i> Agregar al Pedido
                    </button>
                </div>
            `;
            productCatalog.appendChild(card);
        });
    }

    /**
     * Dibuja los productos en el carrito y actualiza el subtotal
     */
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-message">Tu carrito está vacío.</p>';
            sendOrderBtn.classList.add('disabled');
        } else {
             sendOrderBtn.classList.remove('disabled');
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <span>${item.name}</span>
                        <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                        <button class="remove-item-btn" data-id="${item.id}"><i class="fa-solid fa-times"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
                subtotal += item.price * item.quantity;
            });
        }
        
        cartSubtotalElem.textContent = `$${subtotal.toFixed(2)}`;
        updateMobileCartCount();
    }
    
    /**
     * Agrega un producto al carrito
     */
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        showToast(`"${product.name}" fue agregado al carrito.`);
        renderCart();
    }

    /**
     * Actualiza la cantidad de un producto en el carrito
     */
    function updateQuantity(productId, action) {
        const cartItem = cart.find(item => item.id === productId);
        if (!cartItem) return;

        if (action === 'increase') {
            cartItem.quantity++;
        } else if (action === 'decrease') {
            cartItem.quantity--;
            if (cartItem.quantity === 0) {
                removeFromCart(productId);
                return; // Salir para evitar renderizar dos veces
            }
        }
        renderCart();
    }
    
    /**
     * Remueve un producto del carrito
     */
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        showToast("Producto eliminado del carrito.");
        renderCart();
    }

    /**
     * Vacía completamente el carrito
     */
    function clearCart() {
        if (cart.length > 0) {
            cart = [];
            showToast("El carrito ha sido vaciado.");
            renderCart();
        }
    }
    
    /**
     * Muestra una notificación temporal (toast)
     */
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    /**
     * Actualiza el contador del ícono del carrito en móvil
     */
    function updateMobileCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        mobileCartCount.textContent = totalItems;
        mobileCartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    /**
     * Genera y envía el pedido a WhatsApp
     */
    function sendOrder() {
        if (cart.length === 0) {
            showToast("Tu carrito está vacío. Agrega productos para enviar un pedido.");
            return;
        }

        let message = `*¡Hola PP LIMPIO!* 👋\n\nQuisiera realizar el siguiente pedido:\n\n`;
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            message += `*${item.quantity}x* - ${item.name} - *$${itemTotal.toFixed(2)}*\n`;
            subtotal += itemTotal;
        });

        message += `\n*Subtotal del pedido: $${subtotal.toFixed(2)}*`;
        message += `\n\n_Por favor, espero la confirmación y los detalles para el pago._`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    }


    // --- EVENT LISTENERS ---
    
    // Para agregar productos desde el catálogo
    productCatalog.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
    });

    // Para los controles dentro del carrito (aumentar, disminuir, eliminar)
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        
        const productId = parseInt(target.dataset.id);
        
        if (target.classList.contains('quantity-btn')) {
            const action = target.dataset.action;
            updateQuantity(productId, action);
        } else if (target.classList.contains('remove-item-btn')) {
            removeFromCart(productId);
        }
    });

    // Botón para enviar pedido
    sendOrderBtn.addEventListener('click', sendOrder);
    
    // Botón para vaciar carrito
    clearCartBtn.addEventListener('click', clearCart);
    
    // Botones para el carrito en móvil
    mobileCartToggle.addEventListener('click', () => {
        cartSection.classList.toggle('active');
    });

    cartHeader.addEventListener('click', (e) => {
        // Solo permite cerrar el carrito en móvil
        if (window.innerWidth < 992) {
             cartSection.classList.remove('active');
        }
    });


    // --- INICIALIZACIÓN ---
    renderProducts();
    renderCart();
});
