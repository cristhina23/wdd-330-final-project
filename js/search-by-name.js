document.getElementById("searchByNameForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = document.getElementById("searchByNameInput").value.trim();
  const resultsContainer = document.getElementById("searchByNameResults");

  if (!query) {
    showNotification("Please enter a recipe name", "error");
    return;
  }

  resultsContainer.innerHTML = "<p>Loading recipes...</p>";

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();

    if (!data.meals) {
      resultsContainer.innerHTML = `<p>No recipes found for "${query}".</p>`;
      return;
    }

    
    const limitedMeals = data.meals.slice(0, Math.floor(data.meals.length / 3) * 3);

    resultsContainer.innerHTML = limitedMeals
      .map(
        (meal) => `
          <div class="recipe-card fade-in">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h3>${meal.strMeal}</h3>
            <p>📍 ${meal.strArea} | 🍽 ${meal.strCategory}</p>
            <a class="btn btn-primary" href="recipe.html?id=${meal.idMeal}">View Recipe</a>
          </div>
        `
      )
      .join("");

  } catch (error) {
    console.error(error);
    resultsContainer.innerHTML = "<p>An error occurred while fetching recipes.</p>";
  }
});
