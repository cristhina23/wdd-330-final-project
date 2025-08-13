import app from "./firebase.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

const userPhoto = document.getElementById("userPhoto");
const userName = document.getElementById("userName");
const savedRecipesContainer = document.getElementById("savedRecipes");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    
    userPhoto.src = user.photoURL || "images/default-avatar.png";
    userName.textContent = user.displayName || "Usuario";

    
    const q = query(collection(db, "recipes"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      savedRecipesContainer.innerHTML = "<p>No tienes recetas guardadas todavía.</p>";
      return;
    }

    savedRecipesContainer.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const recipe = doc.data();
      savedRecipesContainer.innerHTML += `
        <div class="recipe-card">
          <img src="${recipe.image}" alt="${recipe.title}" />
          <h3>${recipe.title}</h3>
          <p>${recipe.category} - ${recipe.area}</p>
          <a class="btn btn-primary" href="recipe.html?id=${recipe.id}">View Recipe</a>
        </div>
      `;
    });
  } else {
    
    window.location.href = "login.html";
  }
});
