// Data Management
const DataManager = {
  init() {
    if (!localStorage.getItem("smartmeds_user")) {
      localStorage.setItem("smartmeds_user", JSON.stringify({
        name: "User Name",
        email: "user@example.com",
        phone: "",
        dob: "",
        blood: "",
        allergies: "",
      }))
    }
    if (!localStorage.getItem("smartmeds_medicines")) {
      localStorage.setItem("smartmeds_medicines", JSON.stringify([]))
    }
    if (!localStorage.getItem("smartmeds_family")) {
      localStorage.setItem("smartmeds_family", JSON.stringify([]))
    }
    if (!localStorage.getItem("smartmeds_doctors")) {
      localStorage.setItem("smartmeds_doctors", JSON.stringify([]))
    }
  },

  getUser() {
    return JSON.parse(localStorage.getItem("smartmeds_user"))
  },

  updateUser(data) {
    localStorage.setItem("smartmeds_user", JSON.stringify(data))
    this.updateUI()
  },

  getMedicines() {
    return JSON.parse(localStorage.getItem("smartmeds_medicines")) || []
  },

  addMedicine(medicine) {
    const medicines = this.getMedicines()
    medicine.id = Date.now()
    if (selectedImageData) {
      medicine.image = selectedImageData
    }
    medicines.push(medicine)
    localStorage.setItem("smartmeds_medicines", JSON.stringify(medicines))
    return medicine
  },

  deleteMedicine(id) {
    const updated = this.getMedicines().filter(m => m.id !== id)
    localStorage.setItem("smartmeds_medicines", JSON.stringify(updated))
  },

  getFamilyMembers() {
    return JSON.parse(localStorage.getItem("smartmeds_family")) || []
  },

  addFamilyMember(member) {
    const family = this.getFamilyMembers()
    member.id = Date.now()
    family.push(member)
    localStorage.setItem("smartmeds_family", JSON.stringify(family))
  },

  getDoctors() {
    return JSON.parse(localStorage.getItem("smartmeds_doctors")) || []
  },

  addDoctor(doctor) {
    const doctors = this.getDoctors()
    doctor.id = Date.now()
    doctors.push(doctor)
    localStorage.setItem("smartmeds_doctors", JSON.stringify(doctors))
  },

  updateUI() {
    renderDashboard()
    renderMedicines()
    renderFamily()
    renderProfile()
    renderReminders()
  },
}

// Render UI
function renderDashboard() {
  const user = DataManager.getUser()
  const medicines = DataManager.getMedicines()
  const family = DataManager.getFamilyMembers()
  const doctors = DataManager.getDoctors()

  document.getElementById("dashboard-username").textContent = user.name
  document.getElementById("total-medicines").textContent = medicines.length
  document.getElementById("total-family").textContent = family.length
  document.getElementById("total-doctors").textContent = doctors.length

  const todayContainer = document.getElementById("today-medicines")
  if (medicines.length === 0) {
    todayContainer.innerHTML = `<p class="empty-state">No medicines added yet</p>`
  } else {
    todayContainer.innerHTML = medicines.map(m =>
      `<div class="medicine-item">
          <div>
            <h4>${m.name}</h4>
            <p>${m.dosage} • ${m.timing}</p>
          </div>
          <div style="width:30px;height:30px;border-radius:50%;background:${m.color}"></div>
      </div>`
    ).join("")
  }
}

function renderMedicines() {
  const medicines = DataManager.getMedicines()
  const container = document.getElementById("medicines-list")

  if (medicines.length === 0) {
    container.innerHTML = `<p class="empty-state">No medicines yet</p>`
  } else {
    container.innerHTML = medicines.map(m =>
      `<div class="medicine-card">
        <div class="medicine-card-header">
          <div class="medicine-color" style="background:${m.color}"></div>
          <div class="medicine-card-actions">
            <button class="btn btn-sm btn-danger" onclick="deleteMedicineHandler(${m.id})">Delete</button>
          </div>
        </div>
        <h3>${m.name}</h3>
        ${m.image ? `<img src="${m.image}" class="medicine-image">` : ""}
        <p><strong>Dosage:</strong> ${m.dosage}</p>
        <p><strong>Shape:</strong> ${m.shape}</p>
        <p><strong>Frequency:</strong> ${m.frequency}</p>
        <p><strong>Timing:</strong> ${m.timing}</p>
        <p><strong>Time:</strong> ${m.times}</p>
        <p><strong>Notes:</strong> ${m.description || "None"}</p>
      </div>`
    ).join("")
  }
}

function renderFamily() {
  const family = DataManager.getFamilyMembers()
  document.getElementById("family-members-list").innerHTML =
    family.map(f =>
      `<div class="contact-card"><h3>${f.name}</h3><p>${f.relation}</p></div>`
    ).join("") || `<p class="empty-state">No family added</p>`
}

function renderProfile() {
  const user = DataManager.getUser()
  document.getElementById("profile-name").textContent = user.name
  document.getElementById("profile-email").textContent = user.email
}

// --- REMINDER LINK FIX ---
function renderReminders() {
  const medicines = DataManager.getMedicines()
  const c = document.getElementById("reminders-list")

  if (medicines.length === 0) {
    c.innerHTML = `<p class="empty-state">No reminders yet</p>`
  } else {
    c.innerHTML = medicines.map(m =>
      `<div class="reminder-card">
          <div>
            <h4>${m.name}</h4>
            <p>⏰ ${m.times} • ${m.timing}</p>
          </div>
          <button class="btn btn-sm btn-success">Done</button>
      </div>`
    ).join("")
  }
}

// Navigation
function navigateTo(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"))
  document.getElementById(page).classList.add("active")
  DataManager.updateUI()
}

// LOGIN
document.getElementById("login-form")?.addEventListener("submit", (e) => {
  e.preventDefault()
  DataManager.init()
  document.getElementById("login-page").style.display = "none"
  document.getElementById("app-container").style.display = "flex"
  navigateTo("dashboard")
})

// Medicine SAVE FIX
document.getElementById("medicine-form")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const medicine = {
    name: document.getElementById("med-name").value,
    color: document.getElementById("medicine-color").value,
    shape: document.getElementById("med-shape").value,
    dosage: document.getElementById("med-dosage").value,
    frequency: document.getElementById("med-frequency").value,
    timing: document.getElementById("med-timing").value,
    times: document.getElementById("medicine-time").value + " " + document.getElementById("ampm").value,
    description: document.getElementById("med-description").value,
    image: selectedImageData || null
  };

  DataManager.addMedicine(medicine);
  selectedImageData = null;
  document.getElementById("medicine-preview").style.display = "none";
  document.getElementById("medicine-form").reset();
  navigateTo("medicines");
})

// Delete
function deleteMedicineHandler(id) {
  if (confirm("Delete this medicine?")) {
    DataManager.deleteMedicine(id)
    DataManager.updateUI()
  }
}

// Preview Medicine Image
let selectedImageData = null;
document.getElementById("medicine-image")?.addEventListener("change", function () {
  const file = this.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = e => {
    selectedImageData = e.target.result
    document.getElementById("medicine-preview").src = selectedImageData
    document.getElementById("medicine-preview").style.display = "block"
  }
  reader.readAsDataURL(file)
})

// Hash routing
window.addEventListener("hashchange", () => navigateTo(location.hash.slice(1) || "dashboard"))
window.addEventListener("load", () => navigateTo("dashboard"))


