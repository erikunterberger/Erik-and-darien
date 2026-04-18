let latestSubscription = null;

async function loadSubscription() {
  try {
    const response = await fetch("/api/subscription/latest");

    if (!response.ok) {
      document.getElementById("subscriptionStatus").textContent = "Status: No subscription found";
      document.getElementById("subscriptionMonths").textContent = "Months: 0";
      document.getElementById("subscriptionTotal").textContent = "Total Paid: $0";
      document.getElementById("subscriptionName").textContent = "Subscriber: N/A";
      return;
    }

    latestSubscription = await response.json();

    document.getElementById("subscriptionStatus").textContent = "Status: " + latestSubscription.status;
    document.getElementById("subscriptionMonths").textContent = "Months: " + latestSubscription.months;
    document.getElementById("subscriptionTotal").textContent = "Total Paid: $" + latestSubscription.total;
    document.getElementById("subscriptionName").textContent = "Subscriber: " + latestSubscription.fullName;
  } catch (error) {
    console.error("Failed to load subscription:", error);
  }
}

document.getElementById("addMonthsBtn").addEventListener("click", async function () {
  if (!latestSubscription) {
    document.getElementById("manageMessage").textContent = "No subscription found.";
    return;
  }

  const monthsToAdd = parseInt(document.getElementById("monthsToAdd").value, 10);

  try {
    await fetch(`/api/subscription/${latestSubscription._id}/add-months`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthsToAdd })
    });

    document.getElementById("manageMessage").textContent =
      "You added " + monthsToAdd + " month(s) to your subscription.";

    await loadSubscription();
  } catch (error) {
    document.getElementById("manageMessage").textContent = "Error adding months.";
    console.error(error);
  }
});

document.getElementById("cancelBtn").addEventListener("click", async function () {
  if (!latestSubscription) {
    document.getElementById("manageMessage").textContent = "No subscription found.";
    return;
  }

  try {
    await fetch(`/api/subscription/${latestSubscription._id}/cancel`, {
      method: "PUT"
    });

    await fetch("/api/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: latestSubscription._id,
        reason: "User canceled subscription",
        date: new Date().toISOString()
      })
    });

    document.getElementById("manageMessage").textContent =
      "Your subscription has been cancelled.";

    await loadSubscription();
  } catch (error) {
    document.getElementById("manageMessage").textContent = "Error cancelling subscription.";
    console.error(error);
  }
});

loadSubscription();