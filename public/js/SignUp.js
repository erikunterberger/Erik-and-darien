let members = [];

document.addEventListener("DOMContentLoaded", () => {
  const signupDate = document.getElementById("signupDate");
  if (signupDate && !signupDate.value) {
    signupDate.value = new Date().toISOString().split("T")[0];
  }

  setupForm();
  loadMembers();
});

function setupForm() {
  const form = document.getElementById("memberForm");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const submitBtn = document.getElementById("submitBtn");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const signupDate = document.getElementById("signupDate");
    const favoriteTeam = document.getElementById("favoriteTeam");
    const playersTrack = document.getElementById("playersTrack");
    const editIndex = document.getElementById("editIndex");
    const editId = document.getElementById("editId");

    let isValid = true;

    if (!fullName.value.trim()) {
      fullName.classList.add("is-invalid");
      isValid = false;
    } else {
      fullName.classList.remove("is-invalid");
    }

    if (!email.value.trim() || !email.checkValidity()) {
      email.classList.add("is-invalid");
      isValid = false;
    } else {
      email.classList.remove("is-invalid");
    }

    if (!signupDate.value) {
      signupDate.classList.add("is-invalid");
      isValid = false;
    } else {
      signupDate.classList.remove("is-invalid");
    }

    if (!favoriteTeam.value.trim()) {
      favoriteTeam.classList.add("is-invalid");
      isValid = false;
    } else {
      favoriteTeam.classList.remove("is-invalid");
    }

    if (!isValid) return;

    const memberData = {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      signupDate: signupDate.value,
      favoriteTeam: favoriteTeam.value,
      playersTrack: playersTrack.value.trim()
    };

    try {
      if (Number(editIndex.value) >= 0 && editId.value) {
        await fetch(`/api/cart/${editId.value}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(memberData)
        });

        submitBtn.textContent = "Add Fan";
        cancelEditBtn.classList.add("d-none");
        editIndex.value = -1;
        editId.value = "";

        form.reset();
        signupDate.value = new Date().toISOString().split("T")[0];
        await loadMembers();
      } else {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(memberData)
        });

        const createdMember = await response.json();
        window.location.href = `/html/billing.html?cartId=${createdMember._id}`;
      }
    } catch (error) {
      alert("There was an error saving the fan.");
      console.error(error);
    }
  });

  cancelEditBtn.addEventListener("click", () => {
    form.reset();
    document.getElementById("editIndex").value = -1;
    document.getElementById("editId").value = "";
    submitBtn.textContent = "Add Fan";
    cancelEditBtn.classList.add("d-none");
    document.getElementById("signupDate").value = new Date().toISOString().split("T")[0];
  });
}

async function loadMembers() {
  try {
    const response = await fetch("/api/cart");
    members = await response.json();
    renderMembers();
  } catch (error) {
    console.error("Failed to load members:", error);
  }
}

function renderMembers() {
  const tbody = document.querySelector("#membersTable tbody");
  const jsonOutput = document.getElementById("jsonOutput");

  if (!tbody) return;

  tbody.innerHTML = "";

  members.forEach((member, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${member.fullName || ""}</td>
      <td>${member.email || ""}</td>
      <td>${member.phone || ""}</td>
      <td>${member.signupDate || ""}</td>
      <td>${member.favoriteTeam || ""}</td>
      <td>${member.playersTrack || ""}</td>
      <td>${member.status || "Pending"}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editMember('${member._id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteMember('${member._id}')">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  if (jsonOutput) {
    jsonOutput.textContent = JSON.stringify(members, null, 2);
  }
}

function editMember(id) {
  const member = members.find((m) => m._id === id);
  if (!member) return;

  document.getElementById("fullName").value = member.fullName || "";
  document.getElementById("email").value = member.email || "";
  document.getElementById("phone").value = member.phone || "";
  document.getElementById("signupDate").value = member.signupDate || "";
  document.getElementById("favoriteTeam").value = member.favoriteTeam || "";
  document.getElementById("playersTrack").value = member.playersTrack || "";

  const index = members.findIndex((m) => m._id === id);
  document.getElementById("editIndex").value = index;
  document.getElementById("editId").value = id;
  document.getElementById("submitBtn").textContent = "Update Fan";
  document.getElementById("cancelEditBtn").classList.remove("d-none");
}

async function deleteMember(id) {
  if (!confirm("Are you sure you want to delete this fan?")) return;

  try {
    await fetch(`/api/cart/${id}`, {
      method: "DELETE"
    });

    await loadMembers();
  } catch (error) {
    alert("There was an error deleting the fan.");
    console.error(error);
  }
}