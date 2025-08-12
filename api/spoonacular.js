export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET requests allowed" });
  }

  const apiKey = process.env.SPOONACULAR_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing Spoonacular API key" });
  }

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/random?number=10&apiKey=${apiKey}`
    );

    // Si la respuesta no es 200, devolvemos el mensaje de Spoonacular
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: "Spoonacular API error",
        details: errText,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({ error: "Failed to fetch recipes" });
  }
}
