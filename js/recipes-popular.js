// js/recipes-popular.js
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("recipesContainer");

  try {
    const response = await fetch("/api/themealdb");
    const data = await response.json();

    if (!data.recipes || data.recipes.length === 0) {
      container.innerHTML = "<p>No recipes found.</p>";
      return;
    }

    
    let recipes = data.recipes;
    const count = Math.floor(recipes.length / 3) * 3;
    recipes = recipes.slice(0, count);

    container.innerHTML = recipes
      .map(
        (recipe) => `
        <div class="recipe-card">
          <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
          <h3>${recipe.strMeal}</h3>
          <p>📍 ${recipe.strArea} | 🍽 ${recipe.strCategory}</p>
          <a class="btn btn-primary" href="recipe.html?id=${recipe.idMeal}">View Recipe</a>
        </div>
      `
      )
      .join("");

  } catch (error) {
    console.error("Error loading recipes:", error);
    container.innerHTML = "<p>Error loading recipes.</p>";
  }
});
