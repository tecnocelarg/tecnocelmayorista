/* =====================================================
   TECNOCEL - APP
===================================================== */

const MINIMUM_ORDER = 50000;
const WHATSAPP_NUMBER = "5490000000000"; // REEMPLAZAR POR EL NÚMERO REAL

let cart = JSON.parse(localStorage.getItem("tecnocel-cart")) || [];
let currentCategory = "Todos";
let currentProducts = [...products];

/* =====================================================
   UTILIDADES
===================================================== */

function formatPrice(price) {
    if (price === null || price === undefined || Number(price) <= 0) {
        return "Consultar";
    }

    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 2
    }).format(price);
}

function productIcon(product) {
    return product.icon || "📦";
}

/* =====================================================
   PRODUCTOS
===================================================== */

function renderProducts(list = currentProducts) {
    const grid = document.getElementById("products-grid");
    const noResults = document.getElementById("no-results");

    if (!grid) return;

    grid.innerHTML = "";

    if (!list.length) {
        grid.style.display = "none";
        if (noResults) noResults.style.display = "block";
        return;
    }

    grid.style.display = "grid";
    if (noResults) noResults.style.display = "none";

    list.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const hasPrice = product.price !== null && Number(product.price) > 0;
        const outOfStock = !product.stock;

        let priceHTML = hasPrice
            ? `<strong>${formatPrice(product.price)}</strong>`
            : `<strong class="consult-price">Consultar</strong>`;

        let tag = "";

        if (outOfStock) {
            tag = `<span class="product-tag sale">Sin stock</span>`;
        } else if (product.comment) {
            tag = `<span class="product-tag">Disponible</span>`;
        }

        const stockHTML = outOfStock
            ? `<div class="stock stock-off"><span></span>Sin stock</div>`
            : `<div class="stock"><span></span>Disponible</div>`;

        const buttonHTML = (!outOfStock && hasPrice)
            ? `<button class="add-cart" onclick="addToCart(${product.id})">Agregar al carrito</button>`
            : `<button class="add-cart disabled" onclick="consultProduct(${product.id})">${outOfStock ? "Consultar ingreso" : "Consultar precio"}</button>`;

        card.innerHTML = `
            <div class="product-image">
                ${tag}
                <span>${productIcon(product)}</span>
            </div>

            <div class="product-info">
                <div class="product-category">${escapeHTML(product.category)}</div>

                <h3 class="product-name">
                    ${escapeHTML(product.name)}
                </h3>

                ${product.detail ? `
                    <p class="product-detail">
                        ${escapeHTML(product.detail)}
                    </p>
                ` : ""}

                <div class="product-price">
                    ${priceHTML}
                </div>

                ${stockHTML}

                ${buttonHTML}
            </div>
        `;

        grid.appendChild(card);
    });
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function filterCategory(category) {
    currentCategory = category;

    document.querySelectorAll(".filter").forEach(button => {
        button.classList.remove("active");
        if (button.textContent.trim().toLowerCase() === category.toLowerCase()) {
            button.classList.add("active");
        }
    });

    applyFilters();

    const productsSection = document.querySelector("#productos");
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
    }
}

function searchProducts() {
    applyFilters();
}

function applyFilters() {
    const input = document.getElementById("search-input");
    const search = input ? input.value.toLowerCase().trim() : "";

    let filtered = [...products];

    if (currentCategory !== "Todos") {
        filtered = filtered.filter(product => product.category === currentCategory);
    }

    if (search) {
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search) ||
            String(product.detail || "").toLowerCase().includes(search)
        );
    }

    currentProducts = filtered;
    sortProducts(false);
}

function clearSearch() {
    const input = document.getElementById("search-input");
    if (input) input.value = "";
    applyFilters();
}

function focusSearch() {
    const search = document.getElementById("search-input");
    if (!search) return;

    search.focus();
    search.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function sortProducts(scroll = false) {
    const select = document.getElementById("sort-select");
    const value = select ? select.value : "relevance";

    let sorted = [...currentProducts];

    if (value === "price-low") {
        sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    }

    if (value === "price-high") {
        sorted.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    }

    if (value === "new") {
        sorted.sort((a, b) => b.id - a.id);
    }

    if (value === "relevance") {
        sorted.sort((a, b) => a.id - b.id);
    }

    renderProducts(sorted);

    if (scroll) {
        const section = document.querySelector("#productos");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    }
}

/* =====================================================
   CONSULTAS
===================================================== */

function consultProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const message =
        `Hola Tecnocel! 👋\n\n` +
        `Quiero consultar por:\n` +
        `• ${product.name}\n` +
        `${product.detail ? `• Modelo/detalle: ${product.detail}\n` : ""}` +
        `• Categoría: ${product.category}\n\n` +
        `¿Me pueden pasar disponibilidad y precio?`;

    window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank"
    );
}

/* =====================================================
   CARRITO
===================================================== */

function saveCart() {
    localStorage.setItem("tecnocel-cart", JSON.stringify(cart));
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (!product || !product.stock || product.price === null || Number(product.price) <= 0) {
        return;
    }

    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveCart();
    updateCart();
    openCart();
}

function updateCart() {
    const container = document.getElementById("cart-items");
    const empty = document.getElementById("empty-cart");
    const footer = document.getElementById("cart-footer");
    const count = document.getElementById("cart-count");
    const total = document.getElementById("cart-total");

    if (!container || !empty || !footer) return;

    let totalItems = 0;
    let subtotal = 0;

    cart = cart.filter(item => {
        const product = products.find(p => p.id === item.id);
        return product && product.stock && product.price !== null && Number(product.price) > 0;
    });

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        totalItems += item.quantity;
        subtotal += Number(product.price) * item.quantity;
    });

    if (count) count.textContent = totalItems;

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
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div class="cart-item-image">${productIcon(product)}</div>

            <div>
                <h4>${escapeHTML(product.name)}</h4>

                <div class="cart-item-price">
                    ${formatPrice(product.price)}
                </div>

                <div class="quantity-controls">
                    <button onclick="changeQuantity(${product.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${product.id}, 1)">+</button>
                </div>
            </div>

            <button class="remove-item" onclick="removeFromCart(${product.id})">✕</button>
        `;

        container.appendChild(cartItem);
    });

    if (total) total.textContent = formatPrice(subtotal);

    const minimumWarning = document.getElementById("minimum-warning");
    const checkoutButton = document.querySelector(".checkout-button");

    if (minimumWarning) {
        if (subtotal >= MINIMUM_ORDER) {
            minimumWarning.innerHTML = "✓ Pedido mayorista habilitado";
            minimumWarning.style.background = "#e8f8ee";
            minimumWarning.style.color = "#16833d";
        } else {
            const missing = MINIMUM_ORDER - subtotal;
            minimumWarning.innerHTML =
                `Te faltan <strong>${formatPrice(missing)}</strong> para alcanzar el mínimo.`;
            minimumWarning.style.background = "#fff6df";
            minimumWarning.style.color = "#8a6400";
        }
    }

    if (checkoutButton) {
        checkoutButton.classList.toggle("disabled", subtotal < MINIMUM_ORDER);
    }

    saveCart();
}

function changeQuantity(productId, amount) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    saveCart();
    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
}

function clearCart() {
    if (!cart.length) return;

    if (!confirm("¿Seguro que querés vaciar el carrito?")) return;

    cart = [];
    saveCart();
    updateCart();
}

function openCart() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");

    if (drawer) drawer.classList.add("active");
    if (overlay) overlay.classList.add("active");

    document.body.style.overflow = "hidden";
}

function closeCart() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");

    if (drawer) drawer.classList.remove("active");
    if (overlay) overlay.classList.remove("active");

    document.body.style.overflow = "";
}

/* =====================================================
   WHATSAPP / CHECKOUT
===================================================== */

function createWhatsAppMessage() {
    let message = "Hola Tecnocel! 👋\n\n";
    message += "Quiero realizar el siguiente pedido mayorista:\n\n";

    let subtotal = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        const lineTotal = Number(product.price) * item.quantity;
        subtotal += lineTotal;

        message += `• ${product.name}\n`;
        if (product.detail) message += `  ${product.detail}\n`;
        message += `  Cantidad: ${item.quantity}\n`;
        message += `  Precio: ${formatPrice(lineTotal)}\n\n`;
    });

    message += `Subtotal: ${formatPrice(subtotal)}\n`;
    message += `Total: ${formatPrice(subtotal)}\n\n`;
    message += "Quedo a la espera para coordinar el pago y envío.";

    return message;
}

function checkout() {
    let subtotal = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        subtotal += Number(product.price) * item.quantity;
    });

    if (subtotal < MINIMUM_ORDER) {
        alert(`El pedido mínimo mayorista es de ${formatPrice(MINIMUM_ORDER)}.`);
        return;
    }

    const message = createWhatsAppMessage();

    window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank"
    );
}

function openWhatsApp() {
    const message =
        "Hola Tecnocel! 👋 Quería consultar por productos mayoristas.";

    window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank"
    );
}

/* =====================================================
   NEWSLETTER
===================================================== */

function subscribeNewsletter(event) {
    event.preventDefault();

    alert("¡Listo! Te suscribiste a las novedades de Tecnocel.");

    event.target.reset();
}

/* =====================================================
   MOBILE
===================================================== */

function toggleMobileMenu() {
    const menu = document.getElementById("mobile-menu");
    if (!menu) return;

    menu.style.display =
        menu.style.display === "block" ? "none" : "block";
}

function closeMobileMenu() {
    const menu = document.getElementById("mobile-menu");
    if (menu) menu.style.display = "none";
}

/* =====================================================
   INICIALIZACIÓN
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCart();
});
