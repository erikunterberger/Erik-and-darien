function loadSubscription() {
  const subscription = JSON.parse(localStorage.getItem("subscriptionData"));

  if (subscription) {
    document.getElementById("subscriptionStatus").textContent = "Status: " + subscription.status;
    document.getElementById("subscriptionMonths").textContent = "Months: " + subscription.months;
    document.getElementById("subscriptionTotal").textContent = "Total Paid: $" + subscription.total;
  }
}

document.getElementById("addMonthsBtn").addEventListener("click", function () {
  let subscription = JSON.parse(localStorage.getItem("subscriptionData"));

  if (!subscription) {
    subscription = {
      status: "Active",
      months: 0,
      total: 0
    };
  }

  const monthsToAdd = parseInt(document.getElementById("monthsToAdd").value);
  const addedCost = monthsToAdd * 10;

  subscription.months += monthsToAdd;
  subscription.total += addedCost;
  subscription.status = "Active";

  localStorage.setItem("subscriptionData", JSON.stringify(subscription));

  document.getElementById("manageMessage").textContent =
    "You added " + monthsToAdd + " month(s) to your subscription.";

  loadSubscription();
});

document.getElementById("cancelBtn").addEventListener("click", function () {
  let subscription = JSON.parse(localStorage.getItem("subscriptionData"));

  if (subscription) {
    subscription.status = "Cancelled";
    localStorage.setItem("subscriptionData", JSON.stringify(subscription));

    document.getElementById("manageMessage").textContent =
      "Your subscription has been cancelled.";

    loadSubscription();
  }
});

loadSubscription();