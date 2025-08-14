import app from "./firebase.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("recipeDetail");
  const bookmarkIcon = document.querySelector(".bookmark-icon");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  // Variables que necesitaremos fuera del try
  let recipeData = null;
  let ingredients = [];
  let steps = [];

  if (!id) {
    container.innerHTML = "<p>Recipe ID is missing.</p>";
    return;
  }

  try {
    const response = await fetch(`/api/themealdb-id?id=${id}`);
    const data = await response.json();

    if (!data.meals || data.meals.length === 0) {
      container.innerHTML = "<p>Recipe not found.</p>";
      return;
    }

    const recipe = data.meals[0];
    recipeData = recipe;

    // Ingredientes
    for (let i = 1; i <= 20; i++) {
      const ing = recipe[`strIngredient${i}`];
      const mea = recipe[`strMeasure${i}`];
      if (ing && ing.trim() !== "") {
        ingredients.push(`${mea ? mea : ""} ${ing}`.trim());
      }
    }

    // Instrucciones (con guard)
    const raw = recipe.strInstructions || "";
    steps = raw
      .split(/\r?\n|\. /)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    container.innerHTML = `
      <div class="bookmark-icon" id="bookmark-icon">
        <ion-icon name="bookmark"></ion-icon>
      </div>
      <h2>${recipe.strMeal}</h2>
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
      <p><span>Category:</span> ${recipe.strCategory || "-"}</p>
      <p><span>Area:</span> ${recipe.strArea || "-"}</p>

      <h3>Ingredients</h3>
      <ul>
        ${ingredients.map(item => `<li>${item}</li>`).join("")}
      </ul>

      <h3>Instructions</h3>
      <ol>
        ${steps.map(step => `<li>${step.endsWith(".") ? step : step + "."}</li>`).join("")}
      </ol>
    `;
  } catch (error) {
    console.error("Error loading recipe:", error);
    container.innerHTML = "<p>Error loading recipe details.</p>";
  }

  // Click en bookmark
  const icon = document.getElementById("bookmark-icon") || bookmarkIcon;
  if (icon) {
    icon.addEventListener("click", () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          window.location.href = "login.html";
          return;
        }

        try {
          await addDoc(collection(db, "recipes"), {
            userId: user.uid,
            // GUARDA SIEMPRE EL idMeal ORIGINAL
            idMeal: recipeData?.idMeal || id,
            title: recipeData?.strMeal || "",
            image: recipeData?.strMealThumb || "",
            category: recipeData?.strCategory || "",
            area: recipeData?.strArea || "",
            ingredients: ingredients,
            instructions: recipeData?.strInstructions || "",
            createdAt: new Date()
          });
          console.log("Receta guardada correctamente.");
          window.location.href = "dashboard.html";
        } catch (error) {
          console.error("Error guardando receta:", error);
        }
      });
    });
  }
});
