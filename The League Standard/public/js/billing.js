document.getElementById("billingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const billingInfo = {
    cardName: document.getElementById("cardName").value,
    cardNumber: document.getElementById("cardNumber").value,
    billingAddress: document.getElementById("billingAddress").value,
    expDate: document.getElementById("expDate").value,
    cvv: document.getElementById("cvv").value
  };

  localStorage.setItem("billingInfo", JSON.stringify(billingInfo));

  const subscriptionData = {
    status: "Active",
    months: 1,
    total: 10
  };

  localStorage.setItem("subscriptionData", JSON.stringify(subscriptionData));

  window.location.href = "confirmation.html";
});