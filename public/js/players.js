let products = [];
let filteredProducts = [];

const productForm = document.getElementById("productForm");
const productId = document.getElementById("productId");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productStock = document.getElementById("productStock");
const productCategory = document.getElementById("productCategory");
const productImageUrl = document.getElementById("productImageUrl");
const productDescription = document.getElementById("productDescription");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});

async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    products = await response.json();
    filteredProducts = [...products];
    renderTable(filteredProducts);
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

function renderTable(list) {
  const tbody = document.querySelector("#productTable tbody");
  const jsonOutput = document.getElementById("jsonOutput");

  tbody.innerHTML = "";

  list.forEach((product) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${product.name || ""}</td>
      <td>$${Number(product.price || 0).toFixed(2)}</td>
      <td>${product.category || ""}</td>
      <td>${product.stock ?? 0}</td>
      <td>${product.description || ""}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editProduct('${product._id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });

  jsonOutput.textContent = JSON.stringify(list, null, 2);
}

productForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const payload = {
    name: productName.value.trim(),
    price: Number(productPrice.value),
    stock: Number(productStock.value),
    category: productCategory.value.trim() || "Magazine",
    imageUrl: productImageUrl.value.trim(),
    description: productDescription.value.trim()
  };

  try {
    if (productId.value) {
      await fetch(`/api/products/${productId.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    resetForm();
    await loadProducts();
  } catch (error) {
    alert("Error saving product.");
    console.error(error);
  }
});

function editProduct(id) {
  const product = products.find((p) => p._id === id);
  if (!product) return;

  productId.value = product._id;
  productName.value = product.name || "";
  productPrice.value = product.price || "";
  productStock.value = product.stock || 0;
  productCategory.value = product.category || "Magazine";
  productImageUrl.value = product.imageUrl || "";
  productDescription.value = product.description || "";

  submitBtn.textContent = "Update Product";
}

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  try {
    await fetch(`/api/products/${id}`, {
      method: "DELETE"
    });

    await loadProducts();
  } catch (error) {
    alert("Error deleting product.");
    console.error(error);
  }
}

function resetForm() {
  productForm.reset();
  productId.value = "";
  productCategory.value = "Magazine";
  submitBtn.textContent = "Add Product";
}

cancelEditBtn.addEventListener("click", resetForm);

$("#searchInput").on("keyup", function () {
  const value = $(this).val().toLowerCase();

  filteredProducts = products.filter((product) => {
    return (
      String(product.name || "").toLowerCase().includes(value) ||
      String(product.category || "").toLowerCase().includes(value) ||
      String(product.description || "").toLowerCase().includes(value)
    );
  });

  renderTable(filteredProducts);
});

$("#sortSelect").on("change", function () {
  const sortType = $(this).val();
  const copy = [...filteredProducts];

  if (sortType === "name") {
    copy.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortType === "priceLow") {
    copy.sort((a, b) => a.price - b.price);
  } else if (sortType === "priceHigh") {
    copy.sort((a, b) => b.price - a.price);
  }

  renderTable(copy);
});