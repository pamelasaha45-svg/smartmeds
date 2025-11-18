// Simple data manager using localStorage
const DataManager = {
  init() {
    if (!localStorage.getItem("smartmeds_medicines")) {
      localStorage.setItem("smartmeds_medicines", JSON.stringify([]));
    }
    if (!localStorage.getItem("smartmeds_family")) {
      localStorage.setItem("smartmeds_family", JSON.stringify([]));
    }
    if (!localStorage.getItem("smartmeds_doctors")) {
      localStorage.setItem("smartmeds_doctors", JSON.stringify([]));
    }
  },

  getUser() {
    return JSON.parse(localStorage.getItem("smartmeds_user")) || {
      name: "User",
      email: "user@example.com",
      phone: "",
      dob: "",
      blood: "",
      allergies: ""
    };
  },

  setUser(user) {
    localStorage.setItem("smartmeds_user", JSON.stringify(user));
  },

  getMedicines() {
    return JSON.parse(localStorage.getItem("smartmeds_medicines")) || [];
  },

  addMedicine(med) {
    const meds = this.getMedicines();
    med.id = Date.now();
    meds.push(med);
    localStorage.setItem("smartmeds_medicines", JSON.stringify(meds));
  },

  deleteMedicine(id) {
    const meds = this.getMedicines().filter(m => m.id !== id);
    localStorage.setItem("smartmeds_medicines", JSON.stringify(meds));
  },

  getFamilyMembers() {
    return JSON.parse(localStorage.getItem("smartmeds_family")) || [];
  },

  addFamilyMember(member) {
    const fam = this.getFamilyMembers();
    member.id = Date.now();
    fam.push(member);
    localStorage.setItem("smartmeds_family", JSON.stringify(fam));
  },

  getDoctors() {
    return JSON.parse(localStorage.getItem("smartmeds_doctors")) || [];
  },

  addDoctor(doc) {
    const docs = this.getDoctors();
    doc.id = Date.now();
    docs.push(doc);
    localStorage.setItem("smartmeds_doctors", JSON.stringify(docs));
  },

  deleteFamilyMember(id) {
    const fam = this.getFamilyMembers().filter(m => m.id !== id);
    localStorage.setItem("smartmeds_family", JSON.stringify(fam));
  },

  deleteDoctor(id) {
    const docs = this.getDoctors().filter(d => d.id !== id);
    localStorage.setItem("smartmeds_doctors", JSON.stringify(docs));
  }
};

// RENDER FUNCTIONS
function renderDashboard() {
  const user = DataManager.getUser();
  const medicines = DataManager.getMedicines();
  const family = DataManager.getFamilyMembers();
  const doctors = DataManager.getDoctors();

  // username
  const nameSpan = document.getElementById("dashboard-username");
  if (nameSpan) nameSpan.textContent = user.name || "User";

  // stats
  document.getElementById("total-medicines").textContent = medicines.length;
  document.getElementById("total-family").textContent = family.length;
  document.getElementById("total-doctors").textContent = doctors.length;

  // today's medicines
  const todayContainer = document.getElementById("today-medicines");
  if (medicines.length === 0) {
    todayContainer.innerHTML = '<p class="empty-state">No medicines added yet</p>';
  } else {
    todayContainer.innerHTML = medicines.map(m => `
      <div class="medicine-item">
        <div>
          <h4>${m.name}</h4>
          <p>${m.dosage || "No dosage"} • ${m.timing || "No timing"}</p>
        </div>
        <div style="width:28px;height:28px;border-radius:50%;background:${m.color || "#ccc"}"></div>
      </div>
    `).join("");
  }

  // upcoming reminders (simple: first 3)
  const upcoming = document.getElementById("upcoming-reminders");
  if (medicines.length === 0) {
    upcoming.innerHTML = '<p class="empty-state">No reminders set yet</p>';
  } else {
    upcoming.innerHTML = medicines.slice(0,3).map(m => `
      <div class="reminder-item">
        <div>
          <h4>${m.name}</h4>
          <p>Next: ${m.timeLabel || m.times || "Not set"}</p>
        </div>
      </div>
    `).join("");
  }

  // contacts
  const allContacts = [...family, ...doctors];
  const contactsBox = document.getElementById("dashboard-contacts");
  if (allContacts.length === 0) {
    contactsBox.innerHTML = '<p class="empty-state">No contacts added yet</p>';
  } else {
    contactsBox.innerHTML = allContacts.slice(0,3).map(c => `
      <div class="contact-item">
        <div>
          <h4>${c.name}</h4>
          <p>${c.relation || c.specialty || "Contact"}</p>
        </div>
      </div>
    `).join("");
  }
}

function renderMedicines() {
  const meds = DataManager.getMedicines();
  const box = document.getElementById("medicines-list");
  if (!box) return;

  if (meds.length === 0) {
    box.innerHTML = '<p class="empty-state">No medicines added yet. Click "Add Medicine" to get started.</p>';
  } else {
    box.innerHTML = meds.map(m => `
      <div class="medicine-card">
        <div class="medicine-card-header">
          <div class="medicine-color" style="background:${m.color || "#ccc"}"></div>
          <div class="medicine-card-actions">
            <button class="btn btn-sm btn-danger" onclick="deleteMedicineHandler(${m.id})">Delete</button>
          </div>
        </div>
        <h3>${m.name}</h3>
        ${m.image ? `<img src="${m.image}" class="medicine-image">` : ""}
        <p><strong>Dosage:</strong> ${m.dosage || "Not specified"}</p>
        <p><strong>Shape:</strong> ${m.shape || "Not specified"}</p>
        <p><strong>Frequency:</strong> ${m.frequency || "Not specified"}</p>
        <p><strong>When to take:</strong> ${m.timing || "Not specified"}</p>
        <p><strong>Time:</strong> ${m.times || "Not specified"}</p>
        ${m.description ? `<p><strong>Notes:</strong> ${m.description}</p>` : ""}
      </div>
    `).join("");
  }
}

function renderFamily() {
  const fam = DataManager.getFamilyMembers();
  const docs = DataManager.getDoctors();

  const famBox = document.getElementById("family-members-list");
  if (fam.length === 0) {
    famBox.innerHTML = '<p class="empty-state">No family members added yet.</p>';
  } else {
    famBox.innerHTML = fam.map(m => `
      <div class="contact-card">
        <div>
          <h3>${m.name}</h3>
          <p><strong>${m.relation}</strong></p>
          ${m.phone ? `<p>📱 ${m.phone}</p>` : ""}
          ${m.email ? `<p>📧 ${m.email}</p>` : ""}
          ${m.emergency ? `<p style="color:#e11d48;font-weight:600;">⚠️ Emergency Contact</p>` : ""}
        </div>
        <div class="medicine-card-actions">
          <button class="btn btn-sm btn-danger" onclick="deleteFamilyMemberHandler(${m.id})">Delete</button>
        </div>
      </div>
    `).join("");
  }

  const docsBox = document.getElementById("doctors-list");
  if (docs.length === 0) {
    docsBox.innerHTML = '<p class="empty-state">No doctors added yet.</p>';
  } else {
    docsBox.innerHTML = docs.map(d => `
      <div class="contact-card">
        <div>
          <h3>${d.name}</h3>
          <p><strong>${d.specialty || "Healthcare Provider"}</strong></p>
          ${d.clinic ? `<p>🏥 ${d.clinic}</p>` : ""}
          ${d.phone ? `<p>📱 ${d.phone}</p>` : ""}
          ${d.email ? `<p>📧 ${d.email}</p>` : ""}
        </div>
        <div class="medicine-card-actions">
          <button class="btn btn-sm btn-danger" onclick="deleteDoctorHandler(${d.id})">Delete</button>
        </div>
      </div>
    `).join("");
  }
}

function renderProfile() {
  const user = DataManager.getUser();
  const fam = DataManager.getFamilyMembers();
  const docs = DataManager.getDoctors();

  document.getElementById("profile-name").textContent = user.name || "User";
  document.getElementById("profile-email").textContent = user.email || "user@example.com";
  document.getElementById("profile-phone").textContent = user.phone || "Not set";
  document.getElementById("profile-dob").textContent = user.dob || "Not set";
  document.getElementById("profile-blood").textContent = user.blood || "Not set";
  document.getElementById("profile-allergies").textContent = user.allergies || "Not set";

  const initials = (user.name || "U").split(" ").map(n => n[0]).join("").toUpperCase();
  document.getElementById("profile-avatar").textContent = initials;
  document.getElementById("user-avatar").textContent = initials;

  // fill edit form
  document.getElementById("prof-name").value = user.name || "";
  document.getElementById("prof-email").value = user.email || "";
  document.getElementById("prof-phone").value = user.phone || "";
  document.getElementById("prof-dob").value = user.dob || "";
  document.getElementById("prof-blood").value = user.blood || "";
  document.getElementById("prof-allergies").value = user.allergies || "";

  const contactsBox = document.getElementById("profile-contacts");
  const allContacts = [...fam, ...docs];
  if (allContacts.length === 0) {
    contactsBox.innerHTML = '<p class="empty-state">No contacts linked yet</p>';
  } else {
    contactsBox.innerHTML = allContacts.map(c => `
      <div class="contact-item">
        <div>
          <h4>${c.name}</h4>
          <p>${c.relation || c.specialty || "Contact"}</p>
        </div>
      </div>
    `).join("");
  }
}

function renderReminders() {
  const meds = DataManager.getMedicines();
  const box = document.getElementById("reminders-list");
  if (!box) return;

  if (meds.length === 0) {
    box.innerHTML = '<p class="empty-state">No reminders set yet. Add medicines to create reminders.</p>';
  } else {
    let html = "";
    meds.forEach(m => {
      if (m.times) {
        html += `
          <div class="reminder-card">
            <div class="reminder-info">
              <h4>${m.name}</h4>
              <p>⏰ ${m.times} • ${m.timing || ""} • ${m.dosage || ""}</p>
            </div>
            <div class="reminder-actions">
              <button class="btn btn-sm btn-success" onclick="alert('Marked as taken')">Taken</button>
              <button class="btn btn-sm btn-secondary" onclick="alert('Marked as missed')">Missed</button>
            </div>
          </div>
        `;
      }
    });
    box.innerHTML = html || '<p class="empty-state">No reminders set yet.</p>';
  }
}

// NAVIGATION
function navigateTo(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const el = document.getElementById(page);
  if (el) el.classList.add("active");

  if (page === "dashboard") renderDashboard();
  if (page === "medicines") renderMedicines();
  if (page === "family") renderFamily();
  if (page === "profile") renderProfile();
  if (page === "reminders") renderReminders();
}

// DELETE HANDLERS
function deleteMedicineHandler(id) {
  if (confirm("Delete this medicine?")) {
    DataManager.deleteMedicine(id);
    renderMedicines();
    renderDashboard();
    renderReminders();
  }
}

function deleteFamilyMemberHandler(id) {
  if (confirm("Delete this family member?")) {
    DataManager.deleteFamilyMember(id);
    renderFamily();
    renderProfile();
    renderDashboard();
  }
}

function deleteDoctorHandler(id) {
  if (confirm("Delete this doctor?")) {
    DataManager.deleteDoctor(id);
    renderFamily();
    renderProfile();
    renderDashboard();
  }
}

// IMAGE HANDLING
let selectedImageData = null;
const medicineImageInput = document.getElementById("medicine-image");
const medicinePreview = document.getElementById("medicine-preview");

if (medicineImageInput) {
  medicineImageInput.addEventListener("change", function() {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      selectedImageData = e.target.result;
      medicinePreview.src = selectedImageData;
      medicinePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });
}

// FORM LISTENERS
const medicineForm = document.getElementById("medicine-form");
if (medicineForm) {
  medicineForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const timeValue = document.getElementById("medicine-time").value;
    const ampm = document.getElementById("ampm").value;
    const timeLabel = timeValue ? `${timeValue} ${ampm}` : "";

    const med = {
      name: document.getElementById("med-name").value.trim(),
      color: document.getElementById("medicine-color").value,
      shape: document.getElementById("med-shape").value,
      dosage: document.getElementById("med-dosage").value,
      frequency: document.getElementById("med-frequency").value,
      timing: document.getElementById("med-timing").value,
      times: timeLabel,
      description: document.getElementById("med-description").value,
      image: selectedImageData || null
    };

    DataManager.addMedicine(med);
    selectedImageData = null;
    medicinePreview.style.display = "none";
    medicineForm.reset();
    navigateTo("medicines");
    renderDashboard();
    renderReminders();
  });
}

const familyForm = document.getElementById("family-member-form");
if (familyForm) {
  familyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const member = {
      name: document.getElementById("fm-name").value,
      relation: document.getElementById("fm-relation").value,
      phone: document.getElementById("fm-phone").value,
      email: document.getElementById("fm-email").value,
      emergency: document.getElementById("fm-emergency").checked
    };
    DataManager.addFamilyMember(member);
    familyForm.reset();
    navigateTo("family");
    renderFamily();
    renderDashboard();
    renderProfile();
  });
}

const docForm = document.getElementById("doctor-form");
if (docForm) {
  docForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const doc = {
      name: document.getElementById("doc-name").value,
      specialty: document.getElementById("doc-specialty").value,
      phone: document.getElementById("doc-phone").value,
      email: document.getElementById("doc-email").value,
      clinic: document.getElementById("doc-clinic").value
    };
    DataManager.addDoctor(doc);
    docForm.reset();
    navigateTo("family");
    renderFamily();
    renderDashboard();
    renderProfile();
  });
}

const profileForm = document.getElementById("profile-form");
if (profileForm) {
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = {
      name: document.getElementById("prof-name").value,
      email: document.getElementById("prof-email").value,
      phone: document.getElementById("prof-phone").value,
      dob: document.getElementById("prof-dob").value,
      blood: document.getElementById("prof-blood").value,
      allergies: document.getElementById("prof-allergies").value
    };
    DataManager.setUser(user);

    // also update in Firestore if logged in
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await db.collection("users").doc(currentUser.uid).set(user, { merge: true });
      } catch (err) {
        console.log("Profile update error:", err.message);
      }
    }

    navigateTo("profile");
    renderProfile();
  });
}

// NAV LINKS
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    navigateTo(page);
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// Tabs
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(tab).classList.add("active");
  });
});

// User menu dropdown
const userAvatar = document.getElementById("user-avatar");
if (userAvatar) {
  userAvatar.addEventListener("click", () => {
    const dd = document.querySelector(".dropdown-menu");
    dd.classList.toggle("active");
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".user-menu")) {
      document.querySelector(".dropdown-menu")?.classList.remove("active");
    }
  });
}

// LOGIN with Firebase
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      const uid = cred.user.uid;
      const doc = await db.collection("users").doc(uid).get();
      const userData = doc.data() || { email };

      DataManager.setUser(userData);
      localStorage.setItem("smartmeds_logged_in", "true");

      document.getElementById("login-page").style.display = "none";
      document.getElementById("app-container").style.display = "flex";

      DataManager.init();
      renderDashboard();
      renderProfile();
      navigateTo("dashboard");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  });
}

// LOGOUT
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await auth.signOut();
    } catch (e) {
      console.log("Sign out error:", e.message);
    }
    localStorage.removeItem("smartmeds_logged_in");
    document.getElementById("app-container").style.display = "none";
    document.getElementById("login-page").style.display = "block";
  });
}

// INITIAL LOAD
window.addEventListener("load", () => {
  const loggedIn = localStorage.getItem("smartmeds_logged_in") === "true";
  DataManager.init();

  if (loggedIn) {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("app-container").style.display = "flex";
    renderDashboard();
    renderProfile();
    navigateTo("dashboard");
  } else {
    document.getElementById("login-page").style.display = "block";
    document.getElementById("app-container").style.display = "none";
  }
});
