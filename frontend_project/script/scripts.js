let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
    let total = 0;
    cart.forEach(item => total += item.quantity);

    let cartCount = document.getElementById("cart-count");
    if (cartCount) {
        cartCount.innerText = total;
    }
}

// Safe cart icon click
let cartIcon = document.getElementById("cart-icon");
if (cartIcon) {
    cartIcon.onclick = function () {
        window.location.href = "cart.html";
    };
}

const productImages = {
    'Organic Bananas': '../assets/images/organic_bananas.png',
    'Fresh Bananas': '../assets/images/organic_bananas.png',
    'Fresh Strawberries': '../assets/images/fresh_strawberries.png',
    'Organic Tomatoes': '../assets/images/organic_tomatoes.png',
    'Natural Honey': '../assets/images/natural_honey.png',
    'Fresh Organic Milk': '../assets/images/fresh_milk.png',
    'Organic Eggs': '../assets/images/organic_eggs.png',
    'Organic Spinach': '../assets/images/organic_spinach.png',
    'Fresh Orange Juice': '../assets/images/fresh_orange_juice.png',
    'Pure Apple Juice': '../assets/images/pure_apple_juice.png',
    'Organic Grape Juice': '../assets/images/organic_grape_juice.png',
    'Mixed Fruit Juice': '../assets/images/mixed_fruit_juice.png',
    'Organic Red Chili': '../assets/images/organic_red_chili.png'
};

function addToCart(name, price) {
    price = typeof price === 'string' ? parseFloat(price.replace('₹', '')) : price;
    let item = { name, price, quantity: 1, image: productImages[name] || '' };

    let existing = cart.find(p => p.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    
    // Navigate to cart page as requested
    window.location.href = "cart.html";
}

function renderCart() {
    const cartTableBody = document.getElementById("cart-table-body");
    const cartWrapper = document.querySelector(".cart-wrapper");
    const cartContainer = document.querySelector(".cart-container");
    const cartTotal = document.getElementById("cart-subtotal");
    const grandTotalElement = document.getElementById("grand-total");
    
    if (!cartTableBody) return;

    if (cart.length === 0) {
        if (cartWrapper) cartWrapper.style.display = "none";
        // Show empty message
        let emptyMsg = document.getElementById("empty-cart-msg");
        if (!emptyMsg) {
            emptyMsg = document.createElement("div");
            emptyMsg.id = "empty-cart-msg";
            emptyMsg.style.textAlign = "center";
            emptyMsg.style.padding = "100px 0";
            emptyMsg.innerHTML = `
                <i class="fa-solid fa-cart-shopping" style="font-size: 80px; color: #eee; margin-bottom: 20px;"></i>
                <h2 style="color: #666;">Your cart is currently empty.</h2>
                <a href="everything.html" class="checkout-btn" style="display: inline-block; width: auto; margin-top: 30px; text-decoration: none;">RETURN TO SHOP</a>
            `;
            cartContainer.appendChild(emptyMsg);
        }
        return;
    } else {
        if (cartWrapper) cartWrapper.style.display = "flex";
        let emptyMsg = document.getElementById("empty-cart-msg");
        if (emptyMsg) emptyMsg.remove();
    }

    cartTableBody.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, index) => {
        // Fallback for image if not stored
        let imagePath = item.image || productImages[item.name] || '';
        let itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        cartTableBody.innerHTML += `
            <tr>
                <td><button class="remove-item" onclick="removeFromCart(${index})">&times;</button></td>
                <td><img src="${imagePath}" alt="${item.name}" width="70" height="70" style="object-fit: cover; border-radius: 4px;"></td>
                <td style="font-weight: 600; color: #28a745;">${item.name}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>
                    <div class="quantity-control">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </td>
                <td style="font-weight: 700;">₹${itemSubtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    if (cartTotal) cartTotal.innerText = `₹${subtotal.toFixed(2)}`;
    if (grandTotalElement) grandTotalElement.innerText = `₹${subtotal.toFixed(2)}`;
}

function updateQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// Initialize cart view if on cart page
if (document.getElementById("cart-table-body")) {
    renderCart();
}

// Remove the redundant generic click listener for .add-btn as we use onclick in HTML
// document.addEventListener("click", function(e) { ... }); 

function processCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert("Order placed");
    
    // Clear cart
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart(); // Refresh the cart view
}

// Mobile Menu Toggle
const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");

if (menuToggle && navbar) {
    menuToggle.onclick = function () {
        navbar.classList.toggle("active");
    };
}

// Swiper
var swiper = new Swiper(".mySwiper", {
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  slidesPerView: 1,
  spaceBetween: 0,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});