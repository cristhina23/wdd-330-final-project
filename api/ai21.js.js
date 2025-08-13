

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
    const response = await fetch("https://api.ai21.com/studio/v1/j1-large/complete", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AI21_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        maxTokens: 300,
        temperature: 0.7,
        topKReturn: 0,
        topP: 1,
        countPenalty: { scale: 0 },
        frequencyPenalty: { scale: 0 },
        presencePenalty: { scale: 0 }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI21 API error:", response.status, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();

    if (data.completions && data.completions.length > 0) {
      // Extraemos el texto generado
      const generatedText = data.completions[0].data.text.trim();
      res.status(200).json({ generated_text: generatedText });
    } else {
      res.status(500).json({ error: "No completions returned from AI21" });
    }

  } catch (error) {
    console.error("Fetch to AI21 failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
