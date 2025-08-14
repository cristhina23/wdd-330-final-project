document.getElementById("ingredientForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const ingredient = document.getElementById("ingredientInput").value.trim();
  const resultsContainer = document.getElementById("ingredientResults");

  if (!ingredient) {
    showNotification("Please enter an ingredient", "error");
    return;
  }

  resultsContainer.innerHTML = "<p>Loading recipes...</p>";

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await response.json();

    if (!data.meals) {
      resultsContainer.innerHTML = `<p>No recipes found with "${ingredient}".</p>`;
      return;
    }

    resultsContainer.innerHTML = data.meals
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
