// top-recipes.js
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("recipesContainer");

  try {
    const response = await fetch("/api/spoonacular");
    const data = await response.json();

    if (!data.recipes || data.recipes.length === 0) {
      container.innerHTML = "<p>No popular recipes found.</p>";
      return;
    }

    container.innerHTML = data.recipes
      .map(
        (recipe) => `
        <div class="recipe-card">
          <img src="${recipe.image}" alt="${recipe.title}" />
          <h3>${recipe.title}</h3>
          <p>⏱ ${recipe.readyInMinutes} min</p>
          <button onclick="alert('${recipe.summary.replace(/<[^>]+>/g, '')}')">
            View Details
          </button>
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.error("Error loading recipes:", error);
    container.innerHTML = "<p>Error loading recipes.</p>";
  }
});
