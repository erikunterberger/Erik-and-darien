const { useState, useEffect } = React;

function DeliveryPreferencesForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [mailAddress, setMailAddress] = useState("");
  const [gmailAddress, setGmailAddress] = useState("");

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Load name + email from URL (billing page passes them)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFullName(params.get("name") || "");
    setEmail(params.get("email") || "");
  }, []);

  function validate() {
    const newErrors = {};

    if (!deliveryMethod) {
      newErrors.deliveryMethod = "Please select a delivery method.";
    }

    if (deliveryMethod === "mail" && !mailAddress.trim()) {
      newErrors.mailAddress = "Please enter your mailing address.";
    }

    if (deliveryMethod === "gmail" && !gmailAddress.trim()) {
      newErrors.gmailAddress = "Please enter your Gmail address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSuccessMessage("");

    if (!validate()) {
      document.getElementById("submission-status").textContent =
        "Validation failed.";
      return;
    }

    const payload = {
      fullName,
      email,
      deliveryMethod,
      mailingAddress: deliveryMethod === "mail" ? mailAddress : null,
      gmailDelivery: deliveryMethod === "gmail" ? gmailAddress : null,
      timestamp: new Date().toISOString()
    };

    document.getElementById("json-output").textContent =
      JSON.stringify(payload, null, 2);

    document.getElementById("submission-status").textContent =
      "Sending to API…";

    $.ajax({
      url: "https://example.com/api/delivery-preferences",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),

      success: function () {
        document.getElementById("submission-status").textContent =
          "Preferences submitted successfully.";
        setSuccessMessage("Your delivery preferences have been saved.");
      },

      error: function () {
        document.getElementById("submission-status").textContent =
          "Error submitting preferences.";
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* DELIVERY METHOD */}
      <div className="mb-3">
        <label className="form-label d-block">Delivery Method</label>

        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name="delivery"
            value="mail"
            onChange={(e) => setDeliveryMethod(e.target.value)}
          />
          <label className="form-check-label">Physical Mail</label>
        </div>

        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name="delivery"
            value="gmail"
            onChange={(e) => setDeliveryMethod(e.target.value)}
          />
          <label className="form-check-label">Gmail Delivery</label>
        </div>

        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name="delivery"
            value="download"
            onChange={(e) => setDeliveryMethod(e.target.value)}
          />
          <label className="form-check-label">Downloadable PDF</label>
        </div>

        {errors.deliveryMethod && (
          <div className="error-text mt-1">{errors.deliveryMethod}</div>
        )}
      </div>

      {/* CONDITIONAL FIELD: MAILING ADDRESS */}
      {deliveryMethod === "mail" && (
        <div className="mb-3">
          <label className="form-label">Mailing Address</label>
          <input
            type="text"
            className={`form-control ${errors.mailAddress ? "is-invalid" : ""}`}
            value={mailAddress}
            onChange={(e) => setMailAddress(e.target.value)}
            placeholder="123 Main St, City, State"
          />
          {errors.mailAddress && (
            <div className="error-text">{errors.mailAddress}</div>
          )}
        </div>
      )}

      {/* CONDITIONAL FIELD: GMAIL ADDRESS */}
      {deliveryMethod === "gmail" && (
        <div className="mb-3">
          <label className="form-label">Gmail Address</label>
          <input
            type="email"
            className={`form-control ${errors.gmailAddress ? "is-invalid" : ""}`}
            value={gmailAddress}
            onChange={(e) => setGmailAddress(e.target.value)}
            placeholder="example@gmail.com"
          />
          {errors.gmailAddress && (
            <div className="error-text">{errors.gmailAddress}</div>
          )}
        </div>
      )}

      {successMessage && (
        <div className="success-text mb-2">{successMessage}</div>
      )}

      <button className="btn btn-primary">Save Preferences</button>
    </form>
  );
}

ReactDOM.createRoot(
  document.getElementById("finalization-root")
).render(<DeliveryPreferencesForm />);
