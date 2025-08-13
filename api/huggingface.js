export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: "Ingredients are required" });
  }

  const prompt = `Create a detailed recipe using these ingredients: ${ingredients.join(", ")}. Include title, steps, nutrition, cooking time.`;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2",  // Modelo elegido
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API error:", response.status, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log("Hugging Face API data:", data);
    res.status(200).json(data);

  } catch (error) {
    console.error("Fetch to Hugging Face failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}