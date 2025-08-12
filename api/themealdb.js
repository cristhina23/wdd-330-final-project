// api/themealdb.js
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET requests allowed" });
  }

  try {
    // Llamamos varias veces para tener 10 recetas
    const fetchRandomMeal = async () => {
      const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      return resp.json();
    };

    const promises = Array.from({ length: 10 }, () => fetchRandomMeal());
    const results = await Promise.all(promises);

    // Flatten y limpiar datos
    const recipes = results.flatMap(r => r.meals || []);

    res.status(200).json({ recipes });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
}
