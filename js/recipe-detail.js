import app from "./firebase.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("recipeDetail");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  let recipeData = null; // Guardar receta para luego almacenarla
  let ingredients = [];  // Declarar aquí para usar después

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

    // Extraer ingredientes y medidas
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(`${measure ? measure : ""} ${ingredient}`.trim());
      }
    }

    // Formatear instrucciones en pasos
    const steps = recipe.strInstructions
      .split(/\r?\n|\. /)
      .map(step => step.trim())
      .filter(step => step.length > 0);

    container.innerHTML = `
      <div class="bookmark-icon" id="bookmark-icon">
        <ion-icon name="bookmark"></ion-icon>
      </div>
      <h2>${recipe.strMeal}</h2>
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
      <p><span>Category:</span> ${recipe.strCategory}</p>
      <p><span>Area:</span> ${recipe.strArea}</p>

      <h3>Ingredients</h3>
      <ul>
        ${ingredients.map(item => `<li>${item}</li>`).join("")}
      </ul>

      <h3>Instructions</h3>
      <ol>
        ${steps.map(step => `<li>${step}.</li>`).join("")}
      </ol>
    `;

    // Ahora que el HTML está en el DOM, seleccionamos el ícono
    const bookmarkIcon = document.querySelector(".bookmark-icon");
    bookmarkIcon.addEventListener("click", () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          window.location.href = "login.html";
          return;
        }

        try {
          const docData = {
            userId: user.uid,
            title: recipeData.strMeal || null,
            image: recipeData.strMealThumb || null,
            category: recipeData.strCategory || null,
            area: recipeData.strArea || null,
            ingredients: ingredients.length ? ingredients : null,
            instructions: recipeData.strInstructions || null,
            createdAt: new Date()
          };
          console.log("Datos a guardar en Firestore:", docData);

          await addDoc(collection(db, "recipes"), docData);
          console.log("Receta guardada correctamente.");
          window.location.href = "dashboard.html";
        } catch (error) {
          console.error("Error guardando receta:", error);
        }
      });
    });

  } catch (error) {
    console.error("Error loading recipe:", error);
    container.innerHTML = "<p>Error loading recipe details.</p>";
  }
});
