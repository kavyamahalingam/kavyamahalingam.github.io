# Organic Store E-Commerce

A modern, high-fidelity, and fully responsive e-commerce frontend designed for a premium organic product shopping experience. This project demonstrates advanced CSS techniques, smooth animations, and a user-centric design approach.

## 🌟 Features

- **Premium UI/UX**: Clean, mobile-first design with a focus on typography and visual hierarchy.
- **Interactive Banners**: Uses **Swiper.js** for high-performance, touch-enabled slider components.
- **Dynamic Shopping Cart**: A functional real-time cart system (frontend-simulated) to track user selections.
- **Product Categorization**: Intuitive browsing for Farm Fresh Fruits, Vegetables, and Natural Juices.
- **Responsive Layout**: Seamless experience across mobile, tablet, and desktop devices.
- **Micro-interactions**: Hover effects, smooth transitions, and interactive icons to enhance engagement.

## 🛠️ Technologies Used

- **HTML5**: Semantic structure for SEO and accessibility.
- **CSS3 (Vanilla)**: Custom Grid and Flexbox layouts, CSS variables, and keyframe animations.
- **JavaScript (ES6+)**: Dynamic DOM manipulation and cart logic.
- **Swiper.js**: Modern mobile touch slider.
- **Font Awesome**: Professional iconography.
- **Google Fonts**: "Poppins" for a modern, clean look.

## 📂 Project Structure

```text
Organic-Store-Ecommerce/
├── assets/             # Images, SVG logos, and CSS files
├── script/             # Core JavaScript logic (scripts.js)
├── index.html          # Main landing page
├── everything.html     # Full product catalog
├── grocery.html        # Filtered grocery view
├── juice.html          # Filtered juice view
├── cart.html           # Shopping cart overview
└── contact.html        # Contact and support page
```

## 🚀 How it Works Internally

1. **Navigation & Routing**: The application uses relative HTML linking to maintain a fast, SPA-like feel without a heavy framework.
2. **Component Organization**: Styles are separated into specific CSS files (found in `assets/statics/`) for modularity (e.g., `home.css`, `cart.css`).
3. **Cart Logic**: The `scripts.js` file handles the state of the shopping cart using JavaScript arrays and local storage (if applicable), updating the UI dynamically when users add or remove items.
4. **Visual Excellence**: CSS variables are used for theme colors (`#8bc34a` for organic green), making the design system easily maintainable.

---
*Created with passion for clean code and beautiful design.*
