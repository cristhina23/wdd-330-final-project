// js/recipe-detail.js
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("recipeDetail");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

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
      .split(/\r?\n|\. /) // separa por saltos de línea o puntos seguidos de espacio
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
});
