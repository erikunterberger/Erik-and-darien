document.addEventListener("DOMContentLoaded", async () => {
  const deliveryForm = document.getElementById("deliveryForm");
  const mailOption = document.getElementById("mailOption");
  const gmailOption = document.getElementById("gmailOption");
  const downloadOption = document.getElementById("downloadOption");
  const mailAddressGroup = document.getElementById("mailAddressGroup");
  const gmailAddressGroup = document.getElementById("gmailAddressGroup");
  const mailAddress = document.getElementById("mailAddress");
  const gmailAddress = document.getElementById("gmailAddress");
  const jsonOutput = document.getElementById("json-output");
  const submissionStatus = document.getElementById("submission-status");

  let latestSubscription = null;

  try {
    const response = await fetch("/api/subscription/latest");
    if (response.ok) {
      latestSubscription = await response.json();
    }
  } catch (error) {
    console.error("Could not load latest subscription:", error);
  }

  function updateVisibility() {
    const selected = document.querySelector('input[name="deliveryMethod"]:checked')?.value;

    mailAddressGroup.classList.add("d-none");
    gmailAddressGroup.classList.add("d-none");

    if (selected === "mail") {
      mailAddressGroup.classList.remove("d-none");
    } else if (selected === "gmail") {
      gmailAddressGroup.classList.remove("d-none");
    }
  }

  mailOption.addEventListener("change", updateVisibility);
  gmailOption.addEventListener("change", updateVisibility);
  downloadOption.addEventListener("change", updateVisibility);

  deliveryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selected = document.querySelector('input[name="deliveryMethod"]:checked')?.value;

    if (!selected) {
      submissionStatus.textContent = "Please select a delivery method.";
      return;
    }

    if (selected === "mail" && !mailAddress.value.trim()) {
      submissionStatus.textContent = "Please enter a mailing address.";
      return;
    }

    if (selected === "gmail" && !gmailAddress.value.trim()) {
      submissionStatus.textContent = "Please enter a Gmail address.";
      return;
    }

    const payload = {
      fullName: latestSubscription?.fullName || "Unknown",
      email: latestSubscription?.email || "",
      deliveryMethod: selected,
      mailingAddress: selected === "mail" ? mailAddress.value.trim() : "",
      gmailDelivery: selected === "gmail" ? gmailAddress.value.trim() : ""
    };

    jsonOutput.textContent = JSON.stringify(payload, null, 2);
    submissionStatus.textContent = "Sending to database...";

    try {
      const response = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to save shipping info.");
      }

      submissionStatus.textContent = "Preferences submitted successfully.";
    } catch (error) {
      submissionStatus.textContent = "Error submitting preferences.";
      console.error(error);
    }
  });
});