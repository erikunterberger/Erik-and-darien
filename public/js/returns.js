document.addEventListener("DOMContentLoaded", () => {
  loadReturns();

  document.getElementById("returnsForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      cartId: document.getElementById("cartId").value.trim(),
      reason: document.getElementById("reason").value.trim(),
      date: new Date().toISOString(),
      status: "Submitted"
    };

    try {
      await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      document.getElementById("returnMessage").textContent = "Return submitted successfully.";
      document.getElementById("returnsForm").reset();
      loadReturns();
    } catch (error) {
      document.getElementById("returnMessage").textContent = "Error submitting return.";
      console.error(error);
    }
  });
});

async function loadReturns() {
  const tbody = document.querySelector("#returnsTable tbody");
  const returnsJson = document.getElementById("returnsJson");

  try {
    const response = await fetch("/api/returns");
    const returns = await response.json();

    tbody.innerHTML = "";

    returns.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.cartId || ""}</td>
        <td>${item.reason || ""}</td>
        <td>${item.date || ""}</td>
        <td>${item.status || ""}</td>
      `;
      tbody.appendChild(row);
    });

    returnsJson.textContent = JSON.stringify(returns, null, 2);
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="4">Failed to load returns.</td></tr>`;
    console.error(error);
  }
}