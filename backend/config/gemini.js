import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function main(prompt) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Set it in backend .env");
  }

  const model = "gemini-2.5-flash";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }]}],
    });

    const text =
      response?.text ??
      (response?.candidates?.[0]?.content?.parts
        ?.map((p) => p?.text || "")
        .join("\n")) ??
      response?.output_text ??
      "";

    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    return text;
  } catch (err) {
    // Surface a concise error for the controller to return
    const message =
      err?.message ||
      (typeof err === "string" ? err : "Failed to generate content");
    throw new Error(message);
  }
}

export default main;