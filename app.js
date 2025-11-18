// Firebase Auth
const auth = firebase.auth();

// Navigation
const pages = document.querySelectorAll(".page");
const links = document.querySelectorAll(".nav-link");
const userAvatar = document.getElementById("user-avatar");
const logoutBtn = document.getElementById("logout-btn");

// Show selected Page
function showPage(pageId) {
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");

    links.forEach(link => {
        if (link.dataset.page === pageId) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

// Add Navigation Click Events
links.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        showPage(link.dataset.page);
    });
});

// Show Dropdown Menu
userAvatar.addEventListener("click", () => {
    document.querySelector(".dropdown-menu").classList.toggle("active");
});

// Logout
logoutBtn.addEventListener("click", () => {
    auth.signOut().then(() => {
        localStorage.removeItem("loggedIn");
        window.location.href = "signin.html";
    });
});

// Update UI when Logged In
auth.onAuthStateChanged(user => {
    if (user) {
        const initials = (user.displayName || "U")[0];
        userAvatar.textContent = initials.toUpperCase();

        document.getElementById("dashboard-username").textContent =
            user.displayName || "User";
    }
});
