// js/random-recipe.js
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("randomRecipe");

  try {
    // Check if we have a saved recipe in LocalStorage
    const savedRecipe = localStorage.getItem("lastRandomRecipe");
    if (savedRecipe) {
      displayRecipe(JSON.parse(savedRecipe), container);
      return; // If we have one, don't fetch immediately
    }

    // Fetch a random recipe from TheMealDB
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await response.json();

    if (!data.meals || data.meals.length === 0) {
      container.innerHTML = "<p>No recipe found.</p>";
      return;
    }

    const recipe = data.meals[0];

    // Save to LocalStorage
    localStorage.setItem("lastRandomRecipe", JSON.stringify(recipe));

    // Display recipe
    displayRecipe(recipe, container);

  } catch (error) {
    console.error("Error loading random recipe:", error);
    container.innerHTML = "<p>Error loading recipe.</p>";
  }
});

/**
 * Display recipe in the container
 */
function displayRecipe(recipe, container) {
  container.innerHTML = `
    <div class="recipe-card">
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
      <h3>${recipe.strMeal}</h3>
      <p>📍 ${recipe.strArea} | 🍽 ${recipe.strCategory}</p>
      <a class="btn btn-primary" href="recipe.html?id=${recipe.idMeal}">View Recipe</a>
    </div>
  `;
}
