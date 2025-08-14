import app from "./firebase.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const auth = getAuth(app);

const userAvatar = document.getElementById("userAvatar");
const userDropdown = document.getElementById("userDropdown");
const logoutBtn = document.getElementById("logoutBtn");


userAvatar.addEventListener("click", () => {
  userDropdown.classList.toggle("show");
});


document.addEventListener("click", (e) => {
  if (!e.target.closest(".user-menu")) {
    userDropdown.classList.remove("show");
  }
});


onAuthStateChanged(auth, (user) => {
  if (user) {
    userAvatar.src = user.photoURL || "images/user-icon.png";
  } else {
    userAvatar.src = "images/user-icon.png";
  }
});


logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await signOut(auth);
  window.location.href = "index.html";
});
