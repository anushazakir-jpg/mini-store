document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");

  // ==== FORM PAGE ====
  if (form) {
    const genBtn = document.getElementById("generateDescription");

    // AI Description Generator
    if (genBtn) {
      genBtn.addEventListener("click", () => {
        const name = document.getElementById("name").value || "This product";
        const price = document.getElementById("price").value || "affordable price";
        const category = document.getElementById("category").value || "general category";
        const audience = document.getElementById("audience").value || "everyone";

        const description = `${name} is a premium ${category} designed especially for ${audience}. 
        It offers great value at ${price} and ensures the best experience. 
        Perfect choice for those who want quality and reliability!`;

        document.getElementById("description").value = description;
      });
    }

    // Form submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const product = {
        id: Date.now().toString(),
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        category: document.getElementById("category").value,
        audience: document.getElementById("audience").value,
        description: document.getElementById("description").value,
        images: [],
        template: document.getElementById("template").value
      };

      const imageFiles = document.getElementById("images").files;

      if (imageFiles.length > 0) {
        let loaded = 0;
        for (let i = 0; i < imageFiles.length; i++) {
          const reader = new FileReader();
          reader.onload = function (e) {
            product.images.push(e.target.result);
            loaded++;
            if (loaded === imageFiles.length) {
              saveProductToLocal(product);
            }
          };
          reader.readAsDataURL(imageFiles[i]);
        }
      } else {
        saveProductToLocal(product);
      }
    });

    function saveProductToLocal(product) {
      let products = JSON.parse(localStorage.getItem("products")) || [];
      products.push(product);
      localStorage.setItem("products", JSON.stringify(products));

      // ✅ Redirect to product page with ID
      window.location.href = "product.html?id=" + product.id;
    }
  }

  // ==== PRODUCT PAGE ====
  const productContainer = document.getElementById("productContainer");
  if (productContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    const products = JSON.parse(localStorage.getItem("products")) || [];

    if (productId) {
      const product = products.find(p => p.id === productId);
      renderProduct(product);
    } else {
      productContainer.innerHTML = products
        .map(p => `
          <div class="product-card">
            <h3>${p.name}</h3>
            <p><strong>Price:</strong> ${p.price}</p>
            <button onclick="window.location.href='product.html?id=${p.id}'">
              View Details
            </button>
          </div>
        `)
        .join("");
    }
  }

  // ==== RENDER FUNCTION ====
  function renderProduct(product) {
    if (!product) {
      productContainer.innerHTML = "<p>Product not found.</p>";
      return;
    }

    // Template 1
    if (product.template === "template1") {
      productContainer.innerHTML = `
        <div class="product-section">
          <h2>${product.name}</h2>
          <div class="image-gallery">
            ${product.images.map(img => `<img src="${img}">`).join("")}
          </div>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>Target Audience:</strong> ${product.audience}</p>
          <p>${product.description}</p>
          <button onclick="addToCart('${product.id}')">Add to Cart</button>
        </div>
      `;
    }

    // Template 2
    if (product.template === "template2") {
      productContainer.innerHTML = `
        <div class="product-section template2">
          <div class="product-header">
            <h2>${product.name}</h2>
            <div class="price-badge">${product.price}</div>
          </div>
          <div class="product-content">
            <div class="product-info">
              <div class="info-item">
                <span class="label">Category:</span>
                <span class="value">${product.category}</span>
              </div>
              <div class="info-item">
                <span class="label">Target Audience:</span>
                <span class="value">${product.audience}</span>
              </div>
              <div class="description">
                <h3>Description</h3>
                <p>${product.description}</p>
              </div>
              <button onclick="addToCart('${product.id}')">Add to Cart</button>
            </div>
            <div class="product-images">
              ${product.images.length > 0 ? `
                <div class="main-image">
                  <img src="${product.images[0]}" alt="${product.name}" id="mainImage">
                </div>
                ${product.images.length > 1 ? `
                  <div class="thumbnail-gallery">
                    ${product.images.map((img, index) => `
                      <img src="${img}" alt="${product.name}" class="thumbnail ${index === 0 ? 'active' : ''}" 
                          onclick="document.getElementById('mainImage').src='${img}'">
                    `).join("")}
                  </div>
                ` : ''}
              ` : '<p class="no-images">No images uploaded</p>'}
            </div>
          </div>
        </div>
      `;
    }
  }

  // ==== ADD TO CART FUNCTION ====
  window.addToCart = function (productId) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.name} added to cart!`);
  };
});
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const productContainer = document.getElementById("productContainer");
  const cartCount = document.getElementById("cartCount");

  // ==== UPDATE CART COUNT ====
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartCount) cartCount.textContent = cart.length;
  }
  updateCartCount();

  // ==== SAVE TO CART ====
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("✅ Product added to cart!");
  }

  // ==== FORM PAGE ====
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const product = {
        id: Date.now().toString(),
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        category: document.getElementById("category").value,
        audience: document.getElementById("audience").value,
        description: document.getElementById("description").value,
        images: [],
        template: document.getElementById("template").value
      };

      const imageFiles = document.getElementById("images").files;
      if (imageFiles.length > 0) {
        let loaded = 0;
        for (let i = 0; i < imageFiles.length; i++) {
          const reader = new FileReader();
          reader.onload = function (e) {
            product.images.push(e.target.result);
            loaded++;
            if (loaded === imageFiles.length) {
              saveProductToLocal(product);
            }
          };
          reader.readAsDataURL(imageFiles[i]);
        }
      } else {
        saveProductToLocal(product);
      }
    });

    function saveProductToLocal(product) {
      let products = JSON.parse(localStorage.getItem("products")) || [];
      products.push(product);
      localStorage.setItem("products", JSON.stringify(products));
      window.location.href = "product.html?id=" + product.id;
    }
  }

  // ==== PRODUCT PAGE ====
  if (productContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    const products = JSON.parse(localStorage.getItem("products")) || [];

    if (productId) {
      const product = products.find(p => p.id === productId);
      renderProduct(product);
    } else {
      productContainer.innerHTML = products
        .map(p => `
          <div class="product-card">
            <h3>${p.name}</h3>
            <p><strong>Price:</strong> ${p.price}</p>
            <button onclick="window.location.href='product.html?id=${p.id}'">
              View Details
            </button>
          </div>
        `)
        .join("");
    }
  }

  // ==== RENDER FUNCTION ====
  function renderProduct(product) {
    if (!product) {
      productContainer.innerHTML = "<p>Product not found.</p>";
      return;
    }

    productContainer.innerHTML = `
      <div class="product-section">
        <h2>${product.name}</h2>
        <div class="image-gallery">
          ${product.images.map(img => `<img src="${img}">`).join("")}
        </div>
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Target Audience:</strong> ${product.audience}</p>
        <p>${product.description}</p>
        <button id="addToCartBtn">🛒 Add to Cart</button>
      </div>
    `;

    // ✅ Add to Cart button functionality
    const addToCartBtn = document.getElementById("addToCartBtn");
    addToCartBtn.addEventListener("click", () => {
      addToCart(product);
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutSummary = document.getElementById("checkoutSummary");

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    checkoutSummary.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  // Render order summary
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  checkoutSummary.innerHTML = `
    <h3>Order Summary</h3>
    <ul>
      ${cart.map(item => `
        <li>${item.name} (x${item.quantity}) - $${item.price * item.quantity}</li>
      `).join("")}
    </ul>
    <p class="total"><strong>Total: $${total.toFixed(2)}</strong></p>
  `;

  // Handle checkout form submission
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const order = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      payment: document.getElementById("payment").value,
      items: cart,
      total
    };

    // Save order temporarily (future: send to backend / Stripe / PayPal)
   // Checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {
  window.location.href = "checkout.html"; // ✅ Redirect to checkout page
});

  });
});

