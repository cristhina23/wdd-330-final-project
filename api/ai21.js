// api/ai21.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { ingredients } = req.body || {};
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: "Ingredients are required" });
    }

    const prompt = `Create a detailed recipe using these ingredients: ${ingredients.join(
      ", "
    )}. Include title, steps, nutrition, and cooking time.`;

    const aiResp = await fetch(
      "https://api.ai21.com/studio/v1/j1-large/complete",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI21_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          numResults: 1,
          maxTokens: 300,
          temperature: 0.7,
          topKReturn: 0,
          topP: 1,
        }),
      }
    );

    if (!aiResp.ok) {
      const errTxt = await aiResp.text();
      console.error("AI21 API error:", aiResp.status, errTxt);
      return res.status(aiResp.status).json({ error: errTxt });
    }

    const data = await aiResp.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Fetch to AI21 failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
