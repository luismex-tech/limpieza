document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURACIÓN INICIAL ---
    const WHATSAPP_NUMBER = '5214776772422'; // <-- ¡IMPORTANTE! Cambia este número por el de tu negocio.
    
    // --- BASE DE DATOS DE PRODUCTOS ---
    const products = [
        { id: 1, name: 'Jabón Líquido para Trastes (500ml)', price: 25.00, image: 'https://placehold.co/300x300/e8e8e8/333?text=Jabón+Líquido' },
        { id: 2, name: 'Detergente en Polvo (1kg)', price: 45.00, image: 'https://placehold.co/300x300/e8e8e8/333?text=Detergente' },
        { id: 3, name: 'Limpiador Multiusos "Frescura Floral" (1L)', price: 30.00, image: 'https://placehold.co/300x300/e8e8e8/333?text=Limpiador' },
        { id: 4, name: 'Limpiador de Pino Concentrado (1L)', price: 35.00, image: 'https://placehold.co/300x300/e8e8e8/333?text=Pino' },
        { id: 5, name: 'Cloro Blanqueador (1L)', price: 20.00, image: 'https://placehold.co/300x300/e8e8e8/333?text=Cloro' },
        { id: 6, name: 'Shampoo para Auto con Cera (1L)', price: 60.00, image: 'https://placehold.co/300x300/e8e8e8/333?text=Shampoo+Auto' },
        { id: 7, name: 'Abrillantador de Llantas "Negro Intenso" (500ml)', price: 55.00, image: 'https://placehold.co/300x300/e8e8e8/333?text=Abrillantador' },
        { id: 8, name: 'Shampoo Revitalizante (400ml)', price: 50.00, image: 'https://placehold.co/300x300/e8e8e8/333?text=Shampoo' },
        { id: 9, name: 'Jabón Líquido para Manos "Avena y Miel" (500ml)', price: 40.00, image: 'https://placehold.co/300x300/e8e8e8/333?text=Jabón+Manos' },
        { id: 10, name: 'Crema Corporal Hidratante (250ml)', price: 48.00, image: 'https://placehold.co/300x300/e8e8e8/333?text=Crema' },
        { id: 11, name: 'Escoba de Cerdas Rígidas', price: 70.00, image: 'https://placehold.co/300x300/e8e8e8/333?text=Escoba' },
        { id: 12, name: 'Mechudo de Microfibra Absorbente', price: 95.00, image: 'https://placehold.co/300x300/e8e8e8/333?text=Mechudo' }
    ];

    // --- SELECTORES DEL DOM ---
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
    
    // Selectores para el nuevo formulario
    const customerNameInput = document.getElementById('customer-name');
    const customerPhoneInput = document.getElementById('customer-phone');
    const customerCommentsInput = document.getElementById('customer-comments');
    const deliveryOptions = document.querySelectorAll('input[name="delivery-option"]');
    const formErrorsContainer = document.getElementById('form-errors');

    // --- FUNCIONES DEL CATÁLOGO Y CARRITO (sin cambios mayores) ---
    function renderProducts() {
        productCatalog.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `<img src="${product.image}" alt="${product.name}"><div class="product-info"><h3>${product.name}</h3><p class="product-price">$${product.price.toFixed(2)}</p><button class="add-to-cart-btn" data-id="${product.id}"><i class="fa-solid fa-cart-plus"></i> Agregar al Pedido</button></div>`;
            productCatalog.appendChild(card);
        });
    }

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
                cartItem.innerHTML = `<div class="cart-item-info"><span>${item.name}</span><span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span></div><div class="cart-item-controls"><button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button><span>${item.quantity}</span><button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button><button class="remove-item-btn" data-id="${item.id}"><i class="fa-solid fa-times"></i></button></div>`;
                cartItemsContainer.appendChild(cartItem);
                subtotal += item.price * item.quantity;
            });
        }
        cartSubtotalElem.textContent = `$${subtotal.toFixed(2)}`;
        updateMobileCartCount();
    }
    
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) { cartItem.quantity++; } else { cart.push({ ...product, quantity: 1 }); }
        showToast(`"${product.name}" fue agregado al carrito.`);
        renderCart();
    }

    function updateQuantity(productId, action) {
        const cartItem = cart.find(item => item.id === productId);
        if (!cartItem) return;
        if (action === 'increase') { cartItem.quantity++; }
        else if (action === 'decrease') {
            cartItem.quantity--;
            if (cartItem.quantity === 0) { removeFromCart(productId); return; }
        }
        renderCart();
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        showToast("Producto eliminado del carrito.");
        renderCart();
    }

    function clearCart() {
        if (cart.length > 0) {
            cart = [];
            showToast("El carrito ha sido vaciado.");
            renderCart();
        }
    }
    
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    }

    function updateMobileCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        mobileCartCount.textContent = totalItems;
        mobileCartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // --- NUEVAS FUNCIONES DE VALIDACIÓN Y ENVÍO ---

    /**
     * Valida el formulario de datos del cliente.
     * @returns {object|false} - Un objeto con los datos del formulario si es válido, o `false` si hay errores.
     */
    function validateForm() {
        const name = customerNameInput.value.trim();
        const phone = customerPhoneInput.value.trim();
        const comments = customerCommentsInput.value.trim();
        let delivery = '';
        deliveryOptions.forEach(option => {
            if (option.checked) { delivery = option.value; }
        });

        const errors = [];
        formErrorsContainer.innerHTML = '';

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(name) || name.length < 3) {
            errors.push('El nombre es inválido (solo letras y espacios).');
        }
        if (!/^\d{10}$/.test(phone)) {
            errors.push('El teléfono debe contener 10 dígitos numéricos.');
        }
        if (delivery === '') {
            errors.push('Debes seleccionar un método de entrega.');
        }
        if (delivery === 'Envío a Domicilio' && comments.length < 10) {
            errors.push('Para envío, la dirección en comentarios es obligatoria.');
        }

        if (errors.length > 0) {
            const errorList = document.createElement('ul');
            errors.forEach(error => {
                const li = document.createElement('li');
                li.textContent = error;
                errorList.appendChild(li);
            });
            formErrorsContainer.appendChild(errorList);
            return false;
        }
        return { name, phone, delivery, comments };
    }

    /**
     * Genera y envía el pedido a WhatsApp (VERSIÓN ACTUALIZADA).
     */
    function sendOrder() {
        if (cart.length === 0) {
            showToast("Tu carrito está vacío.");
            return;
        }

        const formData = validateForm();
        if (!formData) {
            showToast("Por favor, corrige los errores en el formulario.");
            return; // Detiene el envío si la validación falla
        }

        let message = `*¡Hola PP LIMPIO!* 👋\n\nQuisiera realizar el siguiente pedido:\n\n`;
        message += `*--- DATOS DEL CLIENTE ---*\n`;
        message += `*Nombre:* ${formData.name}\n`;
        message += `*Teléfono:* ${formData.phone}\n`;
        message += `*Método de Entrega:* ${formData.delivery}\n`;
        if (formData.comments) {
            message += `*Comentarios/Dirección:* ${formData.comments}\n`;
        }
        message += `\n*--- PRODUCTOS ---*\n`;
        
        let subtotal = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            message += `*${item.quantity}x* - ${item.name} - *$${itemTotal.toFixed(2)}*\n`;
            subtotal += itemTotal;
        });

        message += `\n*SUBTOTAL: $${subtotal.toFixed(2)}*`;
        message += `\n\n_Espero la confirmación y los detalles para el pago. ¡Gracias!_`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    }

    // --- EVENT LISTENERS ---
    productCatalog.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            const productId = parseInt(e.target.closest('.add-to-cart-btn').dataset.id);
            addToCart(productId);
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        const productId = parseInt(target.dataset.id);
        if (target.classList.contains('quantity-btn')) { updateQuantity(productId, target.dataset.action); } 
        else if (target.classList.contains('remove-item-btn')) { removeFromCart(productId); }
    });

    sendOrderBtn.addEventListener('click', sendOrder);
    clearCartBtn.addEventListener('click', clearCart);
    
    mobileCartToggle.addEventListener('click', () => cartSection.classList.toggle('active'));
    cartHeader.addEventListener('click', () => { if (window.innerWidth < 992) { cartSection.classList.remove('active'); } });

    // Limpia los errores al empezar a interactuar con el formulario
    [customerNameInput, customerPhoneInput, customerCommentsInput].forEach(input => {
        input.addEventListener('input', () => { formErrorsContainer.innerHTML = ''; });
    });
    deliveryOptions.forEach(option => {
        option.addEventListener('change', () => { formErrorsContainer.innerHTML = ''; });
    });

    // --- INICIALIZACIÓN ---
    renderProducts();
    renderCart();
});
