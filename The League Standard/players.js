const playerId = document.getElementById("playerId");
const playerName = document.getElementById("playerName");
const playerTeam = document.getElementById("playerTeam");
const playerPosition = document.getElementById("playerPosition");
const playerYears = document.getElementById("playerYears");
const playerWeight = document.getElementById("playerWeight");
const playerCollege = document.getElementById("playerCollege");
const playerValue = document.getElementById("playerValue");
const playerHeightFeet = document.getElementById("playerHeightFeet");
const playerHeightInches = document.getElementById("playerHeightInches");
const playerPhoto = document.getElementById("playerPhoto");
const playerInfo = document.getElementById("playerInfo");

let players = JSON.parse(localStorage.getItem("players")) || [];
let editIndex = -1;

// Auto-generate ID
function generateId() {
  return "PLR-" + String(players.length + 1).padStart(3, "0");
}

// Convert image to Base64
function convertImage(file, callback) {
  if (!file) return callback("");
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function renderTable() {
  const tbody = document.querySelector("#playerTable tbody");
  tbody.innerHTML = "";

  players.forEach((p, index) => {
    tbody.innerHTML += `
      <tr>
        <td><img src="${p.photo}" width="50" height="50" style="object-fit:cover;border-radius:6px;"></td>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.team}</td>
        <td>${p.position}</td>
        <td>${p.heightFeet}' ${p.heightInches}"</td>
        <td>${p.weight}</td>
        <td>${p.years}</td>
        <td>${p.college}</td>
        <td>${p.value}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editPlayer(${index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deletePlayer(${index})">Delete</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("jsonOutput").textContent = JSON.stringify(players, null, 2);
  localStorage.setItem("players", JSON.stringify(players));
}

document.getElementById("playerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = editIndex === -1 ? generateId() : players[editIndex].id;
  const name = playerName.value.trim();
  const team = playerTeam.value;
  const position = playerPosition.value;
  const years = playerYears.value;
  const weight = playerWeight.value;
  const college = playerCollege.value.trim();
  const value = playerValue.value;

  const heightFeet = parseInt(playerHeightFeet.value);
  const heightInches = parseInt(playerHeightInches.value);
  const totalHeight = heightFeet * 12 + heightInches;

  const photoFile = playerPhoto.files[0];

  if (!name || !team || !position || !years || !weight || !value) {
    alert("Please fill in all required fields.");
    return;
  }

  convertImage(photoFile, (photoBase64) => {
    const playerData = {
      id,
      name,
      team,
      position,
      years,
      weight,
      college,
      value,
      heightFeet,
      heightInches,
      totalHeight,
      photo: photoBase64 || (editIndex !== -1 ? players[editIndex].photo : "")
    };

    if (editIndex === -1) {
      players.push(playerData);
    } else {
      players[editIndex] = playerData;
      editIndex = -1;
    }

    this.reset();
    playerId.value = generateId();
    renderTable();
  });
});

// Edit
function editPlayer(index) {
  const p = players[index];

  playerId.value = p.id;
  playerName.value = p.name;
  playerTeam.value = p.team;
  playerPosition.value = p.position;
  playerYears.value = p.years;
  playerWeight.value = p.weight;
  playerCollege.value = p.college;
  playerValue.value = p.value;
  playerHeightFeet.value = p.heightFeet;
  playerHeightInches.value = p.heightInches;

  editIndex = index;
}

// Delete
function deletePlayer(index) {
  players.splice(index, 1);
  renderTable();
}

// jQuery Search
$("#searchInput").on("keyup", function () {
  let value = $(this).val().toLowerCase();
  $("#playerTable tbody tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});

// Sorting
$("#sortSelect").on("change", function () {
  const sortType = $(this).val();

  if (sortType === "name") {
    players.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortType === "team") {
    players.sort((a, b) => a.team.localeCompare(b.team));
  } else if (sortType === "value") {
    players.sort((a, b) => b.value - a.value);
  }

  renderTable();
});

// Initialize
playerId.value = generateId();
renderTable();
