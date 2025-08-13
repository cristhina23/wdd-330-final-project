import app from "./firebase.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const auth = getAuth(app);

const ingredientInput = document.getElementById("ingredientInput");
const ingredientList = document.getElementById("ingredientList");
const ingredientForm = document.getElementById("ingredientForm");
const getRecipeBtn = document.getElementById("getRecipe");

let ingredients = []; // Guardar todos los ingredientes

// Manejar envío del formulario para agregar ingrediente
ingredientForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const ingredient = ingredientInput.value.trim();

  if (ingredient) {
    ingredients.push(ingredient);

    const li = document.createElement("li");
    li.textContent = ingredient;
    ingredientList.appendChild(li);

    ingredientInput.value = "";
    ingredientInput.focus();
  }
});

// Función para llamar a la API AI21 Studio
async function getRecipeFromAI(ingredients) {
  try {
    const response = await fetch("/api/ai21", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Evento para generar receta
getRecipeBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (ingredients.length < 3) {
    alert("Please add at least 3 ingredients before generating a recipe!");
    return;
  }

  getRecipeBtn.textContent = "Generating...";
  getRecipeBtn.disabled = true;

  getRecipeFromAI(ingredients)
    .then(data => {
      console.log("AI Response:", data);

      if (data?.generated_text) {
        alert(data.generated_text);
      } else {
        alert("No recipe generated. Please try again.");
      }
    })
    .catch(error => {
      console.error("Error generating recipe:", error);
      alert("Error generating recipe. Try again later.");
    })
    .finally(() => {
      getRecipeBtn.textContent = "Get a recipe";
      getRecipeBtn.disabled = false;
    });
});
