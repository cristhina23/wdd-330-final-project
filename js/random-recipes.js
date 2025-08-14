document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("randomRecipes"); 
  if (!container) return; 

  // Load initial recipes (from localStorage or fetch)
  const savedRecipes = localStorage.getItem("lastRandomRecipes");
  if (savedRecipes) {
    displayRecipes(JSON.parse(savedRecipes), container);
  } else {
    await loadRandomRecipes(container);
  }

  // Create and insert reload button after the container
  const reloadBtn = document.createElement("button");
  reloadBtn.textContent = "Get Another Set";
  reloadBtn.className = "btn btn-secondary mt-3";
  reloadBtn.addEventListener("click", async () => {
    await loadRandomRecipes(container, true);
  });

  container.insertAdjacentElement("afterend", reloadBtn);
});

async function loadRandomRecipes(container, forceReload = false) {
  try {
    // Only use localStorage if not forcing reload
    if (!forceReload) {
      const saved = localStorage.getItem("lastRandomRecipes");
      if (saved) {
        displayRecipes(JSON.parse(saved), container);
        return;
      }
    }

    // Fetch 3 random recipes in parallel
    const requests = [1, 2, 3].map(() =>
      fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(res => res.json())
    );

    const results = await Promise.all(requests);
    const recipes = results.map(r => r.meals[0]);

    // Save to LocalStorage
    localStorage.setItem("lastRandomRecipes", JSON.stringify(recipes));

    // Display
    displayRecipes(recipes, container);

  } catch (error) {
    console.error("Error loading random recipes:", error);
    container.innerHTML = "<p>Error loading recipes.</p>";
  }
}

function displayRecipes(recipes, container) {
  container.innerHTML = recipes.map(recipe => `
    <div class="recipe-card">
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
      <h3>${recipe.strMeal}</h3>
      <p>📍 ${recipe.strArea} | 🍽 ${recipe.strCategory}</p>
      <a class="btn btn-primary" href="recipe.html?id=${recipe.idMeal}">View Recipe</a>
    </div>
  `).join("");
}
