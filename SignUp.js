// League Standard - Fan Tracker JS
// Stores fans in localStorage, supports add/update/delete, and renders JSON preview

let members = [];

// Load stored data on page load
document.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("members");
  if (stored) {
    members = JSON.parse(stored);
  }

  // Auto-fill today's date for signup
  const signupDate = document.getElementById("signupDate");
  if (signupDate && !signupDate.value) {
    const today = new Date().toISOString().split("T")[0];
    signupDate.value = today;
  }

  renderMembers();
  setupForm();
});

function setupForm() {
  const form = document.getElementById("memberForm");
  if (!form) return;

  const submitBtn = document.getElementById("submitBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect fields
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const signupDate = document.getElementById("signupDate");
    const favoriteTeam = document.getElementById("favoriteTeam");
    const playersTrack = document.getElementById("playersTrack");
    const editIndex = document.getElementById("editIndex");

    let isValid = true;

    // Validation
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

    // Build fan object
    const memberData = {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      signupDate: signupDate.value,
      favoriteTeam: favoriteTeam.value,
      playersTrack: playersTrack.value.trim()
    };

    const index = parseInt(editIndex.value, 10);

    if (index >= 0) {
      // Update existing entry
      members[index] = memberData;
      submitBtn.textContent = "Add Fan";
      cancelEditBtn.classList.add("d-none");
      editIndex.value = -1;
    } else {
      // Add new entry
      members.push(memberData);
    }

    saveMembers();
    renderMembers();
    form.reset();

    // Refill today's date after reset
    const today = new Date().toISOString().split("T")[0];
    signupDate.value = today;
  });

  cancelEditBtn.addEventListener("click", () => {
    form.reset();
    document.getElementById("editIndex").value = -1;
    submitBtn.textContent = "Add Fan";
    cancelEditBtn.classList.add("d-none");

    // Reset date
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("signupDate").value = today;
  });
}

function saveMembers() {
  localStorage.setItem("members", JSON.stringify(members));
  renderJson();
}

function renderMembers() {
  const tbody = document.querySelector("#membersTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  members.forEach((member, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${member.fullName}</td>
      <td>${member.email}</td>
      <td>${member.phone}</td>
      <td>${member.signupDate}</td>
      <td>${member.favoriteTeam}</td>
      <td>${member.playersTrack}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editMember(${index})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteMember(${index})">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  renderJson();
}

function renderJson() {
  const jsonOutput = document.getElementById("jsonOutput");
  if (!jsonOutput) return;
  jsonOutput.textContent = JSON.stringify(members, null, 2);
}

function editMember(index) {
  const member = members[index];

  document.getElementById("fullName").value = member.fullName;
  document.getElementById("email").value = member.email;
  document.getElementById("phone").value = member.phone;
  document.getElementById("signupDate").value = member.signupDate;
  document.getElementById("favoriteTeam").value = member.favoriteTeam;
  document.getElementById("playersTrack").value = member.playersTrack;

  document.getElementById("editIndex").value = index;
  document.getElementById("submitBtn").textContent = "Update Fan";
  document.getElementById("cancelEditBtn").classList.remove("d-none");
}

function deleteMember(index) {
  if (!confirm("Are you sure you want to delete this fan?")) return;
  members.splice(index, 1);
  saveMembers();
  renderMembers();
}
