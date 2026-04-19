document.addEventListener("DOMContentLoaded", loadProductDetails);

async function loadProductDetails() {
  const container = document.getElementById("productDetailsContainer");

  try {
    const response = await fetch("/api/products");
    const products = await response.json();

    if (!products.length) {
      container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning">No products found. Add one in Product Management first.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = products
      .map(
        (product) => `
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 p-3">
              ${
                product.imageUrl
                  ? `<img src="${product.imageUrl}" class="img-fluid rounded mb-3" alt="${product.name}">`
                  : ""
              }
              <h4>${product.name}</h4>
              <p><strong>Price:</strong> $${Number(product.price).toFixed(2)}</p>
              <p><strong>Category:</strong> ${product.category || "Magazine"}</p>
              <p><strong>Stock:</strong> ${product.stock ?? 0}</p>
              <p>${product.description || "No description available."}</p>
            </div>
          </div>
        `
      )
      .join("");
  } catch (error) {
    container.innerHTML = `<div class="alert alert-danger">Error loading products.</div>`;
    console.error(error);
  }
}