document.getElementById("billingForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const params = new URLSearchParams(window.location.search);
  const cartId = params.get("cartId");

  if (!cartId) {
    alert("Missing cart ID. Please go back and sign up again.");
    return;
  }

  const billingInfo = {
    cartId,
    cardName: document.getElementById("cardName").value.trim(),
    cardNumber: document.getElementById("cardNumber").value.trim(),
    billingAddress: document.getElementById("billingAddress").value.trim(),
    expDate: document.getElementById("expDate").value,
    cvv: document.getElementById("cvv").value.trim(),
    amount: 10
  };

  try {
    await fetch("/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(billingInfo)
    });

    await fetch(`/api/subscription/${cartId}/activate`, {
      method: "PUT"
    });

    window.location.href = "/html/confirmation.html";
  } catch (error) {
    document.getElementById("message").textContent = "Error saving billing information.";
    console.error(error);
  }
});