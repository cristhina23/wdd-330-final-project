document.addEventListener("DOMContentLoaded", function () {
    const ingredientInput = document.getElementById("ingredientInput");
    const findRecipesBtn = document.getElementById("findRecipes");
    const ingredientList = document.getElementById("ingredientList");

    findRecipesBtn.addEventListener("click", function () {
        const inputText = ingredientInput.value.trim();

        if (inputText !== "") {
           
            const ingredients = inputText.split(",").map(item => item.trim());

           
            ingredientList.innerHTML = "";

            
            ingredients.forEach(ingredient => {
                const li = document.createElement("li");
                li.textContent = ingredient;
                ingredientList.appendChild(li);
            });

           
            ingredientInput.value = "";
        } else {
            alert("please enter at least three ingredient");
        }
    });
});
