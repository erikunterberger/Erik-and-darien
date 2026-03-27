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

  document.getElementById("message").textContent = "Subscription completed!";
  this.reset();
});