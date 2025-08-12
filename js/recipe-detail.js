import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("recipeDetail");
  const bookmarkIcon = document.querySelector(".bookmark-icon");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  let recipeData = null; // Guardar receta para luego almacenarla

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
    let ingredients = [];
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
  } catch (error) {
    console.error("Error loading recipe:", error);
    container.innerHTML = "<p>Error loading recipe details.</p>";
  }

  // Manejo del click en el bookmark
  bookmarkIcon.addEventListener("click", () => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Usuario no logueado → ir a login
        window.location.href = "login.html";
        return;
      }

      // Usuario logueado → guardar en Firestore
      try {
        await addDoc(collection(db, "recipes"), {
          userId: user.uid,
          title: recipeData.strMeal,
          image: recipeData.strMealThumb,
          category: recipeData.strCategory,
          area: recipeData.strArea,
          ingredients: ingredients,
          instructions: recipeData.strInstructions,
          createdAt: new Date()
        });
        console.log("Receta guardada correctamente.");
        window.location.href = "dashboard.html";
      } catch (error) {
        console.error("Error guardando receta:", error);
      }
    });
  });
});
