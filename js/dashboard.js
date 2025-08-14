import app from "./firebase.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import alert from "./alert.js"
import aletr from "./alert.js";

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
      savedRecipesContainer.innerHTML = "<p>There are no saved recipes.</p>";
      return;
    }

    savedRecipesContainer.innerHTML = "";
    querySnapshot.forEach((docSnap) => {
      const recipe = docSnap.data();
      const mealId = recipe.idMeal;

      savedRecipesContainer.innerHTML += `
        <div class="recipe-card" data-doc-id="${docSnap.id}">
          <img src="${recipe.image}" alt="${recipe.title}" />
          <h3>${recipe.title}</h3>
          <p>${recipe.category || ""} ${recipe.area ? " - " + recipe.area : ""}</p>
          <div class="delete-icon"><ion-icon name="trash"></ion-icon></div>
          ${mealId
            ? `<a class="btn btn-primary" href="recipe.html?id=${mealId}">View Recipe</a>`
            : `<button class="btn" disabled>No ID</button>`
          }
        </div>
      `;
    });

    
    document.querySelectorAll(".delete-icon").forEach(icon => {
      icon.addEventListener("click", async (e) => {
        const card = e.target.closest(".recipe-card");
        const docId = card.dataset.docId;

        if (!docId) return;

        if (confirm("Are you sure you want to delete this recipe?")) {
          try {
            await deleteDoc(doc(db, "recipes", docId));
            card.remove();

            alert("Recipe deleted successfully.", "success");
          } catch (error) {
            aletr("Error deleting recipe.", "error");
          }
        }
      });
    });

  } else {
    window.location.href = "login.html";
  }
});
