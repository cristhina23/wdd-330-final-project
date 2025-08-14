document.addEventListener("DOMContentLoaded", async () => {
  const randomContainer = document.getElementById("randomRecipes");

  try {
    let randomMeals = [];

    
    for (let i = 0; i < 3; i++) {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      const data = await response.json();
      randomMeals.push(data.meals[0]);
    }

    randomContainer.innerHTML = randomMeals
      .map(
        (meal) => `
          <div class="recipe-card fade-in">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h3>${meal.strMeal}</h3>
            <p>📍 ${meal.strArea} | 🍽 ${meal.strCategory}</p>
            <a class="btn btn-secondary" href="recipe.html?id=${meal.idMeal}">View Recipe</a>
          </div>
        `
      )
      .join("");

  } catch (error) {
    console.error("Error loading random recipes:", error);
    randomContainer.innerHTML = "<p>Error loading random recipes.</p>";
  }
});
