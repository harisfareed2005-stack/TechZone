// Product Data (Mock Database)
const products = [
    {
        id: 1,
        name: "Predator Helios 300",
        category: "Laptop",
        price: 360000,
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        description: "High-performance gaming laptop with RTX 3070."
    },
    {
        id: 2,
        name: "MacBook Pro M2",
        category: "Laptop",
        price: 550000,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        description: "Professional power for creators."
    },
    {
        id: 3,
        name: "Razer BlackWidow V3",
        category: "Accessories",
        price: 35000,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        description: "Mechanical gaming keyboard with RGB lighting."
    },
    {
        id: 4,
        name: "Logitech G Pro X",
        category: "Accessories",
        price: 32000,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        description: "Wireless gaming mouse for professionals."
    },
    {
        id: 5,
        name: "Dell XPS Desktop",
        category: "Desktop",
        price: 300000,
        image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        description: "Powerful desktop for home and office usage."
    }
];

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    updateCartCount();

    // Check if we are on the home page to render featured products
    if (document.querySelector('#featured-products-container')) {
        renderFeaturedProducts();
    }

    // Check if we are on the products page
    if (document.querySelector('#all-products-container')) {
        renderAllProducts(products); // Render all initially
        setupFilters();
    }

    // Check if we are on the product details page
    if (document.querySelector('.product-details-container')) {
        renderProductDetails();
    }

    // Check if we are on the cart page
    if (document.querySelector('#cart-items-container')) {
        renderCartPage();
    }
});

// ... (Existing code) ...

// Cart Page Logic
function renderCartPage() {
    const cart = getCart();
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total');

    if (cart.length === 0) {
        container.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem;">Your cart is empty. <a href="products.html" style="color:var(--accent-color);">Start Shopping</a></td></tr>';
        totalElement.textContent = 'Rs. 0';
        return;
    }

    container.innerHTML = cart.map(item => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                    <span>${item.name}</span>
                </div>
            </td>
            <td>Rs. ${item.price.toLocaleString()}</td>
            <td>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </td>
            <td>Rs. ${(item.price * item.quantity).toLocaleString()}</td>
            <td><button onclick="removeFromCart(${item.id})" class="remove-btn"><i class="fas fa-trash"></i></button></td>
        </tr>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalElement.textContent = `Rs. ${total.toLocaleString()}`;
}

function updateQuantity(productId, change) {
    let cart = getCart();
    const item = cart.find(p => p.id === productId);

    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            removeFromCart(productId);
            return;
        }
    }

    saveCart(cart);
    renderCartPage();
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(p => p.id !== productId);
    saveCart(cart);
    renderCartPage();
}


// Setup Mobile Menu
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// Render Featured Products (Limit to 4)
function renderFeaturedProducts() {
    const container = document.getElementById('featured-products-container');
    const featured = products.slice(0, 4);

    container.innerHTML = featured.map(product => `
        <div class="product-card">
            <div class="product-img">
                <a href="product-details.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                </a>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <a href="product-details.html?id=${product.id}"><h3 class="product-title">${product.name}</h3></a>
                <span class="product-price">Rs. ${product.price.toLocaleString()}</span>
                <button class="btn" onclick="addToCart(${product.id})" style="width: 100%; margin-top: 10px;">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Render All Products with Filtering/Sorting
function renderAllProducts(productsToRender) {
    const container = document.getElementById('all-products-container');
    container.innerHTML = productsToRender.map(product => `
        <div class="product-card">
            <div class="product-img">
                <a href="product-details.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                </a>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <a href="product-details.html?id=${product.id}"><h3 class="product-title">${product.name}</h3></a>
                <span class="product-price">Rs. ${product.price.toLocaleString()}</span>
                <button class="btn" onclick="addToCart(${product.id})" style="width: 100%; margin-top: 10px;">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    const categorySelect = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-filter');

    function filterAndSort() {
        let filtered = [...products];
        const category = categorySelect.value;
        const sort = sortSelect.value;

        if (category !== 'all') {
            filtered = filtered.filter(p => p.category === category);
        }

        if (sort === 'low-high') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'high-low') {
            filtered.sort((a, b) => b.price - a.price);
        }

        renderAllProducts(filtered);
    }

    categorySelect.addEventListener('change', filterAndSort);
    sortSelect.addEventListener('change', filterAndSort);
}

// Render Product Details
function renderProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const product = products.find(p => p.id === productId);

    if (!product) {
        document.querySelector('.product-details-container').innerHTML = '<h2>Product not found</h2>';
        return;
    }

    // Update Page Elements
    document.getElementById('detail-img').src = product.image;
    document.getElementById('detail-name').textContent = product.name;
    document.getElementById('detail-category').textContent = product.category;
    document.getElementById('detail-price').textContent = `Rs. ${product.price.toLocaleString()}`;
    document.getElementById('detail-desc').textContent = product.description;

    // Add to Cart Button Logic
    const addBtn = document.getElementById('detail-add-btn');
    addBtn.onclick = () => addToCart(product.id);

    // Related Products (Same Category, exclude current)
    const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
    const relatedContainer = document.getElementById('related-products');

    if (related.length > 0) {
        relatedContainer.innerHTML = related.map(p => `
            <div class="product-card">
                <div class="product-img">
                    <a href="product-details.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>
                </div>
                <div class="product-info">
                    <span class="product-category">${p.category}</span>
                    <a href="product-details.html?id=${p.id}"><h3 class="product-title">${p.name}</h3></a>
                    <span class="product-price">Rs. ${p.price.toLocaleString()}</span>
                    <button class="btn" onclick="addToCart(${p.id})" style="width: 100%; margin-top: 10px;">Add to Cart</button>
                </div>
            </div>
        `).join('');
    } else {
        relatedContainer.innerHTML = '<p>No related products found.</p>';
    }
}

// Cart Logic
function getCart() {
    return JSON.parse(localStorage.getItem('techZoneCart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('techZoneCart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    const cart = getCart();
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    alert(`${product.name} added to cart!`);
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.querySelector('.cart-count');
    if (badge) {
        badge.textContent = count;
    }
}
