document.addEventListener("DOMContentLoaded", async () => {
  const recipeSection = document.getElementById("recipeDetail");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    recipeSection.innerHTML = "<p>No recipe selected.</p>";
    return;
  }

  try {
    const res = await fetch(`/api/spoonacular-id?id=${id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const recipe = await res.json();

    recipeSection.innerHTML = `
      <article class="recipe-detail-card">
        <h1>${recipe.title}</h1>
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-detail-image" />
        <p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
        <p><strong>Servings:</strong> ${recipe.servings}</p>
        <div class="recipe-summary">${recipe.summary}</div>
        <h2>Ingredients</h2>
        <ul>
          ${recipe.extendedIngredients
            .map(ing => `<li>${ing.original}</li>`)
            .join("")}
        </ul>
        <h2>Instructions</h2>
        <div>${recipe.instructions || "<p>No instructions provided.</p>"}</div>
      </article>
    `;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    recipeSection.innerHTML = "<p>Failed to load recipe details.</p>";
  }
});
