// Data Management
const DataManager = {
  // Initialize data from localStorage
  init() {
    if (!localStorage.getItem("smartmeds_user")) {
      localStorage.setItem(
        "smartmeds_user",
        JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
          phone: "",
          dob: "",
          blood: "",
          allergies: "",
        }),
      )
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

  // User methods
  getUser() {
    return JSON.parse(localStorage.getItem("smartmeds_user"))
  },

  updateUser(data) {
    localStorage.setItem("smartmeds_user", JSON.stringify(data))
    this.updateUI()
  },

  // Medicines methods
  getMedicines() {
    return JSON.parse(localStorage.getItem("smartmeds_medicines")) || []
  },

  addMedicine(medicine) {
    const medicines = this.getMedicines()
    medicine.id = Date.now()
    if (selectedImageData) {
    medicine.image = selectedImageData;
  }
  if (medicine.image) {
  html += `<img src="${medicine.image}" alt="Medicine Image" class="medicine-image">`;
}

    medicines.push(medicine)
    localStorage.setItem("smartmeds_medicines", JSON.stringify(medicines))
    return medicine
  },

  updateMedicine(id, data) {
    const medicines = this.getMedicines()
    const index = medicines.findIndex((m) => m.id === id)
    if (index !== -1) {
      medicines[index] = { ...medicines[index], ...data }
      localStorage.setItem("smartmeds_medicines", JSON.stringify(medicines))
    }
  },

  deleteMedicine(id) {
    const medicines = this.getMedicines().filter((m) => m.id !== id)
    localStorage.setItem("smartmeds_medicines", JSON.stringify(medicines))
  },

  // Family methods
  getFamilyMembers() {
    return JSON.parse(localStorage.getItem("smartmeds_family")) || []
  },

  addFamilyMember(member) {
    const family = this.getFamilyMembers()
    member.id = Date.now()
    family.push(member)
    localStorage.setItem("smartmeds_family", JSON.stringify(family))
    return member
  },

  updateFamilyMember(id, data) {
    const family = this.getFamilyMembers()
    const index = family.findIndex((m) => m.id === id)
    if (index !== -1) {
      family[index] = { ...family[index], ...data }
      localStorage.setItem("smartmeds_family", JSON.stringify(family))
    }
  },

  deleteFamilyMember(id) {
    const family = this.getFamilyMembers().filter((m) => m.id !== id)
    localStorage.setItem("smartmeds_family", JSON.stringify(family))
  },

  // Doctors methods
  getDoctors() {
    return JSON.parse(localStorage.getItem("smartmeds_doctors")) || []
  },

  addDoctor(doctor) {
    const doctors = this.getDoctors()
    doctor.id = Date.now()
    doctors.push(doctor)
    localStorage.setItem("smartmeds_doctors", JSON.stringify(doctors))
    return doctor
  },

  updateDoctor(id, data) {
    const doctors = this.getDoctors()
    const index = doctors.findIndex((d) => d.id === id)
    if (index !== -1) {
      doctors[index] = { ...doctors[index], ...data }
      localStorage.setItem("smartmeds_doctors", JSON.stringify(doctors))
    }
  },

  deleteDoctor(id) {
    const doctors = this.getDoctors().filter((d) => d.id !== id)
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

// UI Rendering
function renderDashboard() {
  const user = DataManager.getUser()
  const medicines = DataManager.getMedicines()
  const family = DataManager.getFamilyMembers()
  const doctors = DataManager.getDoctors()

  // Update username
  document.getElementById("dashboard-username").textContent = user.name

  // Update stats
  document.getElementById("total-medicines").textContent = medicines.length
  document.getElementById("total-family").textContent = family.length
  document.getElementById("total-doctors").textContent = doctors.length

  // Render today's medicines
  const todayMedicinesContainer = document.getElementById("today-medicines")
  if (medicines.length === 0) {
    todayMedicinesContainer.innerHTML = '<p class="empty-state">No medicines added yet</p>'
  } else {
    todayMedicinesContainer.innerHTML = medicines
      .map(
        (med) => `
            <div class="medicine-item">
                <div>
                    <h4>${med.name}</h4>
                    <p>${med.dosage || "No dosage"} • ${med.timing || "No timing"}</p>
                </div>
                <div style="width: 30px; height: 30px; border-radius: 50%; background-color: ${med.color};"></div>
            </div>
        `,
      )
      .join("")
  }

  // Render upcoming reminders
  const upcomingRemindersContainer = document.getElementById("upcoming-reminders")
  if (medicines.length === 0) {
    upcomingRemindersContainer.innerHTML = '<p class="empty-state">No reminders set yet</p>'
  } else {
    upcomingRemindersContainer.innerHTML = medicines
      .slice(0, 3)
      .map(
        (med) => `
            <div class="reminder-item">
                <div>
                    <h4>${med.name}</h4>
                    <p>Next: ${med.times ? med.times.split(",")[0] : "Not set"}</p>
                </div>
            </div>
        `,
      )
      .join("")
  }

  // Render contacts
  const contactsContainer = document.getElementById("dashboard-contacts")
  const allContacts = [...family, ...doctors]
  if (allContacts.length === 0) {
    contactsContainer.innerHTML = '<p class="empty-state">No contacts added yet</p>'
  } else {
    contactsContainer.innerHTML = allContacts
      .slice(0, 3)
      .map(
        (contact) => `
            <div class="contact-item">
                <div>
                    <h4>${contact.name}</h4>
                    <p>${contact.relation || contact.specialty || "Contact"}</p>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

function renderMedicines() {
  const medicines = DataManager.getMedicines()
  const container = document.getElementById("medicines-list")

  if (medicines.length === 0) {
    container.innerHTML = '<p class="empty-state">No medicines added yet. Click "Add Medicine" to get started.</p>'
  } else {
    container.innerHTML = medicines
      .map(
        (med) => `
            <div class="medicine-card">
                <div class="medicine-card-header">
                    <div class="medicine-color" style="background-color: ${med.color};"></div>
                    <div class="medicine-card-actions">
                        <button class="btn btn-sm btn-primary" onclick="editMedicine(${med.id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteMedicineHandler(${med.id})">Delete</button>
                    </div>
                </div>
                <h3>${med.name}</h3>
                <p><strong>Dosage:</strong> ${med.dosage || "Not specified"}</p>
                <p><strong>Shape:</strong> ${med.shape || "Not specified"}</p>
                <p><strong>Frequency:</strong> ${med.frequency || "Not specified"}</p>
                <p><strong>When to take:</strong> ${med.timing || "Not specified"}</p>
                <p><strong>Times:</strong> ${med.times || "Not specified"}</p>
                ${med.description ? `<p><strong>Notes:</strong> ${med.description}</p>` : ""}
            </div>
        `,
      )
      .join("")
  }
}

function renderFamily() {
  const family = DataManager.getFamilyMembers()
  const doctors = DataManager.getDoctors()

  // Render family members
  const familyContainer = document.getElementById("family-members-list")
  if (family.length === 0) {
    familyContainer.innerHTML = '<p class="empty-state">No family members added yet.</p>'
  } else {
    familyContainer.innerHTML = family
      .map(
        (member) => `
            <div class="contact-card">
                <div style="flex: 1;">
                    <h3>${member.name}</h3>
                    <p><strong>${member.relation}</strong></p>
                    ${member.phone ? `<p>📱 ${member.phone}</p>` : ""}
                    ${member.email ? `<p>📧 ${member.email}</p>` : ""}
                    ${member.emergency ? '<p style="color: var(--danger-color); font-weight: 600;">⚠️ Emergency Contact</p>' : ""}
                </div>
                <div class="medicine-card-actions">
                    <button class="btn btn-sm btn-primary" onclick="editFamilyMember(${member.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteFamilyMemberHandler(${member.id})">Delete</button>
                </div>
            </div>
        `,
      )
      .join("")
  }

  // Render doctors
  const doctorsContainer = document.getElementById("doctors-list")
  if (doctors.length === 0) {
    doctorsContainer.innerHTML = '<p class="empty-state">No doctors added yet.</p>'
  } else {
    doctorsContainer.innerHTML = doctors
      .map(
        (doctor) => `
            <div class="contact-card">
                <div style="flex: 1;">
                    <h3>${doctor.name}</h3>
                    <p><strong>${doctor.specialty || "Healthcare Provider"}</strong></p>
                    ${doctor.clinic ? `<p>🏥 ${doctor.clinic}</p>` : ""}
                    ${doctor.phone ? `<p>📱 ${doctor.phone}</p>` : ""}
                    ${doctor.email ? `<p>📧 ${doctor.email}</p>` : ""}
                </div>
                <div class="medicine-card-actions">
                    <button class="btn btn-sm btn-primary" onclick="editDoctor(${doctor.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDoctorHandler(${doctor.id})">Delete</button>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

function renderProfile() {
  const user = DataManager.getUser()
  const family = DataManager.getFamilyMembers()
  const doctors = DataManager.getDoctors()

  // Update profile display
  document.getElementById("profile-name").textContent = user.name
  document.getElementById("profile-email").textContent = user.email
  document.getElementById("profile-phone").textContent = user.phone || "Not set"
  document.getElementById("profile-dob").textContent = user.dob || "Not set"
  document.getElementById("profile-blood").textContent = user.blood || "Not set"
  document.getElementById("profile-allergies").textContent = user.allergies || "Not set"

  // Update avatar
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
  document.getElementById("profile-avatar").textContent = initials
  document.getElementById("user-avatar").textContent = initials

  // Update profile form
  document.getElementById("prof-name").value = user.name
  document.getElementById("prof-email").value = user.email
  document.getElementById("prof-phone").value = user.phone || ""
  document.getElementById("prof-dob").value = user.dob || ""
  document.getElementById("prof-blood").value = user.blood || ""
  document.getElementById("prof-allergies").value = user.allergies || ""

  // Render contacts
  const contactsContainer = document.getElementById("profile-contacts")
  const allContacts = [...family, ...doctors]
  if (allContacts.length === 0) {
    contactsContainer.innerHTML = '<p class="empty-state">No contacts linked yet</p>'
  } else {
    contactsContainer.innerHTML = allContacts
      .map(
        (contact) => `
            <div class="contact-item">
                <div>
                    <h4>${contact.name}</h4>
                    <p>${contact.relation || contact.specialty || "Contact"}</p>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

function renderReminders() {
  const medicines = DataManager.getMedicines()
  const container = document.getElementById("reminders-list")

  if (medicines.length === 0) {
    container.innerHTML = '<p class="empty-state">No reminders set yet. Add medicines to create reminders.</p>'
  } else {
    let remindersHTML = ""
    medicines.forEach((med) => {
      if (med.times) {
        const times = med.times.split(",").map((t) => t.trim())
        times.forEach((time) => {
          remindersHTML += `
                        <div class="reminder-card">
                            <div class="reminder-info">
                                <h4>${med.name}</h4>
                                <p>⏰ ${time} • ${med.timing || "No timing"} • ${med.dosage || "No dosage"}</p>
                            </div>
                            <div class="reminder-actions">
                                <button class="btn btn-sm btn-success" onclick="markTaken(${med.id})">Taken</button>
                                <button class="btn btn-sm btn-warning" onclick="markMissed(${med.id})">Missed</button>
                            </div>
                        </div>
                    `
        })
      }
    })
    container.innerHTML = remindersHTML || '<p class="empty-state">No reminders set yet.</p>'
  }
}

// Navigation
function navigateTo(page) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"))

  // Show selected page
  const pageElement = document.getElementById(page)
  if (pageElement) {
    pageElement.classList.add("active")
  }

  // Update nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
    if (link.dataset.page === page) {
      link.classList.add("active")
    }
  })

  // Render page content
  if (page === "dashboard") renderDashboard()
  else if (page === "medicines") renderMedicines()
  else if (page === "family") renderFamily()
  else if (page === "profile") renderProfile()
  else if (page === "reminders") renderReminders()
}

// Login
document.getElementById("login-form")?.addEventListener("submit", (e) => {
  e.preventDefault()
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  if (email && password) {
    // Hide login, show app
    document.getElementById("login-page").classList.remove("active")
    document.getElementById("app-container").style.display = "flex"

    // Initialize and render
    DataManager.init()
    renderDashboard()
    renderProfile()
    navigateTo("dashboard")
  }
})

// Logout
document.getElementById("logout-btn")?.addEventListener("click", () => {
  document.getElementById("login-page").classList.add("active")
  document.getElementById("app-container").style.display = "none"
  document.getElementById("login-form").reset()
})

// Medicine form
document.getElementById("medicine-form")?.addEventListener("submit", (e) => {
  e.preventDefault()

  const medicine = {
    name: document.getElementById("med-name").value,
    color: document.getElementById("med-color").value,
    shape: document.getElementById("med-shape").value,
    dosage: document.getElementById("med-dosage").value,
    frequency: document.getElementById("med-frequency").value,
    timing: document.getElementById("med-timing").value,
    times: document.getElementById("med-times").value,
    description: document.getElementById("med-description").value,
  }

  DataManager.addMedicine(medicine)
  document.getElementById("medicine-form").reset()
  navigateTo("medicines")
  DataManager.updateUI()
})

// Family member form
document.getElementById("family-member-form")?.addEventListener("submit", (e) => {
  e.preventDefault()

  const member = {
    name: document.getElementById("fm-name").value,
    relation: document.getElementById("fm-relation").value,
    phone: document.getElementById("fm-phone").value,
    email: document.getElementById("fm-email").value,
    emergency: document.getElementById("fm-emergency").checked,
  }

  DataManager.addFamilyMember(member)
  document.getElementById("family-member-form").reset()
  navigateTo("family")
  DataManager.updateUI()
})

// Doctor form
document.getElementById("doctor-form")?.addEventListener("submit", (e) => {
  e.preventDefault()

  const doctor = {
    name: document.getElementById("doc-name").value,
    specialty: document.getElementById("doc-specialty").value,
    phone: document.getElementById("doc-phone").value,
    email: document.getElementById("doc-email").value,
    clinic: document.getElementById("doc-clinic").value,
  }

  DataManager.addDoctor(doctor)
  document.getElementById("doctor-form").reset()
  navigateTo("family")
  DataManager.updateUI()
})

// Profile form
document.getElementById("profile-form")?.addEventListener("submit", (e) => {
  e.preventDefault()

  const user = {
    name: document.getElementById("prof-name").value,
    email: document.getElementById("prof-email").value,
    phone: document.getElementById("prof-phone").value,
    dob: document.getElementById("prof-dob").value,
    blood: document.getElementById("prof-blood").value,
    allergies: document.getElementById("prof-allergies").value,
  }

  DataManager.updateUser(user)
  navigateTo("profile")
})

// Delete handlers
function deleteMedicineHandler(id) {
  if (confirm("Are you sure you want to delete this medicine?")) {
    DataManager.deleteMedicine(id)
    DataManager.updateUI()
  }
}

function deleteFamilyMemberHandler(id) {
  if (confirm("Are you sure you want to delete this family member?")) {
    DataManager.deleteFamilyMember(id)
    DataManager.updateUI()
  }
}

function deleteDoctorHandler(id) {
  if (confirm("Are you sure you want to delete this doctor?")) {
    DataManager.deleteDoctor(id)
    DataManager.updateUI()
  }
}

// Reminder actions
function markTaken(id) {
  alert("Medicine marked as taken!")
}

function markMissed(id) {
  alert("Medicine marked as missed!")
}

// Tab switching
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabName = btn.dataset.tab

    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"))
    document.querySelectorAll(".tab-content").forEach((t) => t.classList.remove("active"))

    btn.classList.add("active")
    document.getElementById(tabName).classList.add("active")
  })
})

// Nav links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    navigateTo(link.dataset.page)
  })
})

// User menu dropdown
document.querySelector(".user-avatar")?.addEventListener("click", () => {
  const dropdown = document.querySelector(".dropdown-menu")
  dropdown.classList.toggle("active")
})

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".user-menu")) {
    document.querySelector(".dropdown-menu")?.classList.remove("active")
  }
})

// Hash-based routing
window.addEventListener("hashchange", () => {
  const page = window.location.hash.slice(1) || "dashboard"
  navigateTo(page)
})

// Initialize on load
window.addEventListener("load", () => {
  const isLoggedIn = localStorage.getItem("smartmeds_logged_in")
  if (isLoggedIn) {
    document.getElementById("login-page").classList.remove("active")
    document.getElementById("app-container").style.display = "flex"
    DataManager.init()
    navigateTo("dashboard")
  }
})

// Mark as logged in on login
document.getElementById("login-form")?.addEventListener("submit", () => {
  localStorage.setItem("smartmeds_logged_in", "true")
})
// Your existing code above...

// ------------------------
// Add this at the very end
// ------------------------
document.addEventListener("DOMContentLoaded", function() {
  // Initially show login, hide dashboard
  const loginPage = document.getElementById("login-page");
  const appContainer = document.getElementById("app-container");

  loginPage.style.display = "block";
  appContainer.style.display = "none";

  // Handle login
  document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    // Dummy login success (you can replace this with real auth)
    loginPage.style.display = "none";
    appContainer.style.display = "block";
  });

  // Handle logout
  document.getElementById("logout-btn").addEventListener("click", function() {
    appContainer.style.display = "none";
    loginPage.style.display = "block";
  });
});

 const medicineImageInput = document.getElementById("medicine-image");
const medicinePreview = document.getElementById("medicine-preview");
let selectedImageData = null; // will store image in Base64

if (medicineImageInput) {
  medicineImageInput.addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        selectedImageData = e.target.result; // store image data
        medicinePreview.src = selectedImageData;
        medicinePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
}

