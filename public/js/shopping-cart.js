document.addEventListener("DOMContentLoaded", loadCart);

async function loadCart() {
  const tbody = document.querySelector("#cartTable tbody");
  const cartJson = document.getElementById("cartJson");

  try {
    const response = await fetch("/api/cart");
    const items = await response.json();

    tbody.innerHTML = "";

    items.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.fullName || ""}</td>
        <td>${item.email || ""}</td>
        <td>${item.productName || ""}</td>
        <td>${item.months || 0}</td>
        <td>$${Number(item.total || 0).toFixed(2)}</td>
        <td>${item.status || ""}</td>
      `;
      tbody.appendChild(row);
    });

    cartJson.textContent = JSON.stringify(items, null, 2);
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="6">Failed to load cart items.</td></tr>`;
    console.error(error);
  }
}