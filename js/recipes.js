const ingredientInput = document.getElementById("ingredientInput");
const addIngredientBtn = document.getElementById("addIngredient");
const ingredientList = document.getElementById("ingredientList");
const getRecipeBtn = document.getElementById("getRecipe");

let ingredients = []; // Guardar todos los ingredientes

// Agregar ingrediente a la lista
addIngredientBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const ingredient = ingredientInput.value.trim();

  if (ingredient) {
    ingredients.push(ingredient); // Guardar en el array

    const li = document.createElement("li");
    li.textContent = ingredient;
    ingredientList.appendChild(li);

    ingredientInput.value = "";
    ingredientInput.focus();
  }
});

// Función para llamar a la API de Hugging Face
async function getRecipeFromAI(prompt) {
  try {
    const response = await fetch("/api/huggingface", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    console.log("AI Response:", data);
    return data;

  } catch (error) {
    console.error("Error:", error);
  }
}

// Botón para generar la receta
getRecipeBtn.addEventListener("click", () => {
  if (ingredients.length === 0) {
    alert("Please add at least one ingredient!");
    return;
  }

  const prompt = `Crea una receta deliciosa usando estos ingredientes: ${ingredients.join(", ")}.`;
  
  // Mostrar mensaje de carga
  getRecipeBtn.textContent = "Generating...";
  getRecipeBtn.disabled = true;

  getRecipeFromAI(prompt).then(data => {
    console.log("AI Response:", data);
    alert(data[0]?.generated_text || "No recipe generated.");
  }).finally(() => {
    getRecipeBtn.textContent = "Get a recipe";
    getRecipeBtn.disabled = false;
  });
});
