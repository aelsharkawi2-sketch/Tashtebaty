import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { base64, mimeType, prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing GEMINI_API_KEY in Vercel Environment Variables");
      return res.status(400).json({ error: "Missing API key" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt || "صف الصورة بجملة قصيرة وواضحة بالعربية." },
                { inlineData: { mimeType, data: base64 } },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Gemini API Error:", data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("💥 Gemini serverless error:", err);
    return res.status(500).json({ error: err.message });
  }
}
