
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("randomRecipes"); 

  if (!container) return; 

 
  const savedRecipe = localStorage.getItem("lastRandomRecipe");
  if (savedRecipe) {
    displayRecipe(JSON.parse(savedRecipe), container);
  } else {
    await loadRandomRecipe(container);
  }


  const reloadBtn = document.createElement("button");
  reloadBtn.textContent = "Get Another Recipe";
  reloadBtn.className = "btn btn-secondary";
  reloadBtn.addEventListener("click", async () => {
    await loadRandomRecipe(container, true);
  });

  container.parentElement.appendChild(reloadBtn);
});


async function loadRandomRecipe(container, forceReload = false) {
  try {
    if (!forceReload) {
      const saved = localStorage.getItem("lastRandomRecipe");
      if (saved) {
        displayRecipe(JSON.parse(saved), container);
        return;
      }
    }

    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await response.json();

    if (!data.meals || data.meals.length === 0) {
      container.innerHTML = "<p>No recipe found.</p>";
      return;
    }

    const recipe = data.meals[0];
    localStorage.setItem("lastRandomRecipe", JSON.stringify(recipe));
    displayRecipe(recipe, container);

  } catch (error) {
    console.error("Error loading random recipe:", error);
    container.innerHTML = "<p>Error loading recipe.</p>";
  }
}


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
