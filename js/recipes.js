document.getElementById("ingredientForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const ingredient = document.getElementById("ingredientInput").value.trim();
  const resultsContainer = document.getElementById("ingredientResults");

  if (!ingredient) {
    showNotification("Please enter an ingredient", "error");
    return;
  }

 
  localStorage.setItem("lastIngredient", ingredient);

  resultsContainer.innerHTML = "<p>Loading recipes...</p>";

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await response.json();

    if (!data.meals) {
      resultsContainer.innerHTML = `<p>No recipes found with "${ingredient}".</p>`;
      return;
    }

    let meals = data.meals;
    const count = Math.floor(meals.length / 3) * 3;
    meals = meals.slice(0, count);

    resultsContainer.innerHTML = meals
      .map(
        (meal) => `
        <div class="recipe-card">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <h3>${meal.strMeal}</h3>
          <a class="btn btn-secondary" href="recipe.html?id=${meal.idMeal}">View Recipe</a>
        </div>
      `
      )
      .join("");

  } catch (error) {
    console.error(error);
    resultsContainer.innerHTML = "<p>An error occurred while fetching recipes.</p>";
  }
});


document.addEventListener("DOMContentLoaded", async () => {
  const lastIngredient = localStorage.getItem("lastIngredient");
  if (lastIngredient) {
    document.getElementById("ingredientInput").value = lastIngredient;

    
    document.getElementById("ingredientForm").dispatchEvent(new Event("submit"));
  }
});
