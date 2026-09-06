/* =====================================================
   TECNOCEL - PRODUCTOS
===================================================== */

const products = [

    {
        id: 1,
        name: "Funda MagSafe Transparente iPhone",
        category: "Fundas",
        price: 4500,
        oldPrice: 6000,
        discount: 25,
        icon: "📱",
        tag: "Oferta",
        stock: 25,
        isNew: true
    },

    {
        id: 2,
        name: "Funda Silicona Premium iPhone",
        category: "Fundas",
        price: 3900,
        oldPrice: null,
        discount: 0,
        icon: "📱",
        tag: "Mayorista",
        stock: 40,
        isNew: true
    },

    {
        id: 3,
        name: "Cargador USB-C 20W",
        category: "Cargadores",
        price: 8500,
        oldPrice: 10000,
        discount: 15,
        icon: "🔌",
        tag: "Oferta",
        stock: 18,
        isNew: false
    },

    {
        id: 4,
        name: "Cable Lightning Premium 1M",
        category: "Cargadores",
        price: 3500,
        oldPrice: null,
        discount: 0,
        icon: "🔌",
        tag: "Mayorista",
        stock: 60,
        isNew: true
    },

    {
        id: 5,
        name: "Vidrio Templado iPhone",
        category: "Vidrios",
        price: 1800,
        oldPrice: 2500,
        discount: 28,
        icon: "🛡️",
        tag: "Oferta",
        stock: 100,
        isNew: false
    },

    {
        id: 6,
        name: "Vidrio Privacidad iPhone",
        category: "Vidrios",
        price: 2800,
        oldPrice: null,
        discount: 0,
        icon: "🛡️",
        tag: "Mayorista",
        stock: 75,
        isNew: true
    },

    {
        id: 7,
        name: "Auriculares Bluetooth Pro",
        category: "Audio",
        price: 14500,
        oldPrice: 18000,
        discount: 20,
        icon: "🎧",
        tag: "Oferta",
        stock: 14,
        isNew: true
    },

    {
        id: 8,
        name: "AirPods Pro Gen 2",
        category: "Audio",
        price: 42000,
        oldPrice: null,
        discount: 0,
        icon: "🎧",
        tag: "Mayorista",
        stock: 8,
        isNew: true
    },

    {
        id: 9,
        name: "Parlante Bluetooth Mini",
        category: "Parlantes",
        price: 12000,
        oldPrice: 15000,
        discount: 20,
        icon: "🔊",
        tag: "Oferta",
        stock: 20,
        isNew: false
    },

    {
        id: 10,
        name: "Parlante Bluetooth 10W",
        category: "Parlantes",
        price: 18500,
        oldPrice: null,
        discount: 0,
        icon: "🔊",
        tag: "Nuevo",
        stock: 12,
        isNew: true
    },

    {
        id: 11,
        name: "Soporte Magnético para Auto",
        category: "Accesorios",
        price: 5500,
        oldPrice: 7000,
        discount: 21,
        icon: "🚗",
        tag: "Oferta",
        stock: 32,
        isNew: false
    },

    {
        id: 12,
        name: "Power Bank 10.000 mAh",
        category: "Accesorios",
        price: 13500,
        oldPrice: null,
        discount: 0,
        icon: "🔋",
        tag: "Mayorista",
        stock: 16,
        isNew: true
    }

];


/* =====================================================
   VARIABLES
===================================================== */

let cart = JSON.parse(
    localStorage.getItem("tecnocel-cart")
) || [];

let currentCategory = "Todos";

let currentProducts = [...products];


/* =====================================================
   FORMATO DE PRECIO
===================================================== */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "es-AR",
        {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0
        }
    ).format(price);

}


/* =====================================================
   MOSTRAR PRODUCTOS
===================================================== */

function renderProducts(list = currentProducts) {

    const grid =
        document.getElementById("products-grid");

    const noResults =
        document.getElementById("no-results");


    grid.innerHTML = "";


    if (!list.length) {

        grid.style.display = "none";

        noResults.style.display = "block";

        return;

    }


    grid.style.display = "grid";

    noResults.style.display = "none";


    list.forEach(product => {

        const card =
            document.createElement("article");

        card.className = "product-card";


        let priceHTML = `
            <strong>${formatPrice(product.price)}</strong>
        `;


        if (product.oldPrice) {

            priceHTML += `
                <span class="old-price">
                    ${formatPrice(product.oldPrice)}
                </span>
            `;

        }


        if (product.discount) {

            priceHTML += `
                <span class="discount">
                    -${product.discount}%
                </span>
            `;

        }


        card.innerHTML = `

            <div class="product-image">

                ${
                    product.tag
                    ?
                    `
                    <span class="
                        product-tag
                        ${product.discount ? "sale" : ""}
                    ">
                        ${product.tag}
                    </span>
                    `
                    :
                    ""
                }

                <span>
                    ${product.icon}
                </span>

            </div>


            <div class="product-info">

                <div class="product-category">
                    ${product.category}
                </div>

                <h3 class="product-name">
                    ${product.name}
                </h3>


                <div class="product-price">

                    ${priceHTML}

                </div>


                <div class="stock">

                    <span></span>

                    ${product.stock} disponibles

                </div>


                <button
                    class="add-cart"
                    onclick="addToCart(${product.id})"
                >
                    Agregar al carrito
                </button>

            </div>

        `;


        grid.appendChild(card);

    });

}


/* =====================================================
   FILTRAR CATEGORÍA
===================================================== */

function filterCategory(category) {

    currentCategory = category;


    document
        .querySelectorAll(".filter")
        .forEach(button => {

            button.classList.remove("active");

            if (
                button.textContent.trim() === category
            ) {
                button.classList.add("active");
            }

        });


    applyFilters();


    document
        .querySelector("#productos")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =====================================================
   BÚSQUEDA
===================================================== */

function searchProducts() {

    applyFilters();

}


function applyFilters() {

    const searchInput =
        document.getElementById("search-input");

    const search =
        searchInput
        ?
        searchInput.value
            .toLowerCase()
            .trim()
        :
        "";


    let filtered = [...products];


    if (currentCategory !== "Todos") {

        filtered =
            filtered.filter(
                product =>
                    product.category === currentCategory
            );

    }


    if (search) {

        filtered =
            filtered.filter(product =>

                product.name
                    .toLowerCase()
                    .includes(search)

                ||

                product.category
                    .toLowerCase()
                    .includes(search)

            );

    }


    currentProducts = filtered;


    sortProducts(false);

}


function clearSearch() {

    const input =
        document.getElementById("search-input");

    input.value = "";

    applyFilters();

}


function focusSearch() {

    const search =
        document.getElementById("search-input");

    search.focus();

    search.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =====================================================
   ORDENAR
===================================================== */

function sortProducts(scroll = false) {

    const select =
        document.getElementById("sort-select");

    const value =
        select.value;


    let sorted = [...currentProducts];


    if (value === "price-low") {

        sorted.sort(
            (a, b) => a.price - b.price
        );

    }


    if (value === "price-high") {

        sorted.sort(
            (a, b) => b.price - a.price
        );

    }


    if (value === "new") {

        sorted.sort(
            (a, b) =>
                Number(b.isNew) -
                Number(a.isNew)
        );

    }


    if (value === "relevance") {

        sorted.sort(
            (a, b) => a.id - b.id
        );

    }


    renderProducts(sorted);


    if (scroll) {

        document
            .querySelector("#productos")
            .scrollIntoView({
                behavior: "smooth"
            });

    }

}


/* =====================================================
   CARRITO
===================================================== */

function saveCart() {

    localStorage.setItem(
        "tecnocel-cart",
        JSON.stringify(cart)
    );

}


function addToCart(productId) {

    const product =
        products.find(
            p => p.id === productId
        );


    if (!product) return;


    const existing =
        cart.find(
            item => item.id === productId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            id: product.id,
            quantity: 1
        });

    }


    saveCart();

    updateCart();


    openCart();

}


/* =====================================================
   ACTUALIZAR CARRITO
===================================================== */

function updateCart() {

    const container =
        document.getElementById("cart-items");

    const empty =
        document.getElementById("empty-cart");

    const footer =
        document.getElementById("cart-footer");

    const count =
        document.getElementById("cart-count");

    const total =
        document.getElementById("cart-total");


    let totalItems = 0;

    let subtotal = 0;


    cart.forEach(item => {

        const product =
            products.find(
                p => p.id === item.id
            );

        if (!product) return;

        totalItems += item.quantity;

        subtotal +=
            product.price *
            item.quantity;

    });


    count.textContent = totalItems;


    if (!cart.length) {

        container.innerHTML = "";

        empty.style.display = "flex";

        footer.style.display = "none";

        return;

    }


    empty.style.display = "none";

    footer.style.display = "block";


    container.innerHTML = "";


    cart.forEach(item => {

        const product =
            products.find(
                p => p.id === item.id
            );

        if (!product) return;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-image">
                ${product.icon}
            </div>


            <div>

                <h4>
                    ${product.name}
                </h4>

                <div class="cart-item-price">
                    ${formatPrice(product.price)}
                </div>


                <div class="quantity-controls">

                    <button
                        onclick="changeQuantity(
                            ${product.id},
                            -1
                        )"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(
                            ${product.id},
                            1
                        )"
                    >
                        +
                    </button>

                </div>

            </div>


            <button
                class="remove-item"
                onclick="removeFromCart(${product.id})"
            >
                ✕
            </button>

        `;


        container.appendChild(cartItem);

    });


    total.textContent =
        formatPrice(subtotal);


    const minimumWarning =
        document.getElementById(
            "minimum-warning"
        );


    if (subtotal >= 50000) {

        minimumWarning.innerHTML =
            "✓ Pedido mayorista habilitado";

        minimumWarning.style.background =
            "#e8f8ee";

        minimumWarning.style.color =
            "#16833d";

    } else {

        const missing =
            50000 - subtotal;

        minimumWarning.innerHTML =
            `
            Te faltan
            <strong>
                ${formatPrice(missing)}
            </strong>
            para alcanzar el mínimo.
            `;

        minimumWarning.style.background =
            "#fff6df";

        minimumWarning.style.color =
            "#8a6400";

    }

}


/* =====================================================
   CAMBIAR CANTIDAD
===================================================== */

function changeQuantity(productId, amount) {

    const item =
        cart.find(
            item => item.id === productId
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== productId
            );

    }


    saveCart();

    updateCart();

}


/* =====================================================
   ELIMINAR
===================================================== */

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );


    saveCart();

    updateCart();

}


/* =====================================================
   VACIAR
===================================================== */

function clearCart() {

    if (!cart.length) return;


    const confirmed =
        confirm(
            "¿Seguro que querés vaciar el carrito?"
        );


    if (!confirmed) return;


    cart = [];

    saveCart();

    updateCart();

}


/* =====================================================
   ABRIR / CERRAR CARRITO
===================================================== */

function openCart() {

    document
        .getElementById("cart-drawer")
        .classList.add("active");

    document
        .getElementById("cart-overlay")
        .classList.add("active");

    document.body.style.overflow = "hidden";

}


function closeCart() {

    document
        .getElementById("cart-drawer")
        .classList.remove("active");

    document
        .getElementById("cart-overlay")
        .classList.remove("active");

    document.body.style.overflow = "";

}


/* =====================================================
   CHECKOUT
===================================================== */

function checkout() {

    let subtotal = 0;


    cart.forEach(item => {

        const product =
            products.find(
                p => p.id === item.id
            );

        if (!product) return;


        subtotal +=
            product.price *
            item.quantity;

    });


    if (subtotal < 50000) {

        alert(
            "El pedido mínimo mayorista es de $50.000."
        );

        return;

    }


    const message =
        createWhatsAppMessage();


    const phone =
        "5490000000000";


    window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank"
    );

}


/* =====================================================
   WHATSAPP
===================================================== */

function createWhatsAppMessage() {

    let message =
        "Hola Tecnocel! 👋\n\n";

    message +=
        "Quiero realizar el siguiente pedido mayorista:\n\n";


    let subtotal = 0;


    cart.forEach(item => {

        const product =
            products.find(
                p => p.id === item.id
            );

        if (!product) return;


        const lineTotal =
            product.price *
            item.quantity;


        subtotal += lineTotal;


        message +=
            `• ${product.name}\n`;

        message +=
            `  Cantidad: ${item.quantity}\n`;

        message +=
            `  Precio: ${formatPrice(lineTotal)}\n\n`;

    });


    message +=
        `Subtotal: ${formatPrice(subtotal)}\n`;

    message +=
        `Total: ${formatPrice(subtotal)}\n\n`;

    message +=
        "Quedo a la espera para coordinar el pago y envío.";


    return message;

}


function openWhatsApp() {

    const phone =
        "5490000000000";


    const message =
        "Hola Tecnocel! 👋 Quería consultar por productos mayoristas.";


    window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank"
    );

}


/* =====================================================
   NEWSLETTER
===================================================== */

function subscribeNewsletter(event) {

    event.preventDefault();


    alert(
        "¡Listo! Te suscribiste a las novedades de Tecnocel."
    );


    event.target.reset();

}


/* =====================================================
   MOBILE MENU
===================================================== */

function toggleMobileMenu() {

    const menu =
        document.getElementById("mobile-menu");


    if (
        menu.style.display === "block"
    ) {

        menu.style.display = "none";

    } else {

        menu.style.display = "block";

    }

}


function closeMobileMenu() {

    document
        .getElementById("mobile-menu")
        .style.display = "none";

}


/* =====================================================
   INICIALIZACIÓN
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderProducts();

        updateCart();

    }
);
