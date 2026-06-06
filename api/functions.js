import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCharacter } from "../src/payload.js";

export async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method no permitido."
        })
    }
    try {
        const {characterKey, messages} = req.body;
        if (!characterKey || !Array.isArray(messages)) {
            return res.status(400).json({
                error: "Request inválido"
            });
        }

        const character = getCharacter(characterKey);
        if (!character) {
            return res.status(400).json({
                error: "Personaje no válido"
            });
        }

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return res.status(500).json({
                error: "GEMINI_API_KEY no configurada"
            })
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model:"gemini-1.5-flash"});
        
        const conversationText = messages
        .map(m => `${m.role}: ${m.content}`)
        .join("\n");

        const prompt = `
        ${character.system}
        
        Conversación:
        ${conversationText}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ reply: text });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error generando respuesta" });
    }
}