import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCharacter } from "./payload.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        console.log("Método no permitido:", req.method);
        return res.status(405).json({
            error: "Method no permitido."
        })
    }
    try {
        console.log("Request body:", req.body);
        const {characterKey, messages} = req.body;
        if (!characterKey || !Array.isArray(messages)) {
            console.log("Request body:", req.body);
            return res.status(400).json({
                error: "Request inválido"
            });
        }

        const character = getCharacter(characterKey);
        if (!character) {
            console.log("Personaje no válido:", characterKey);
            return res.status(400).json({
                error: "Personaje no válido"
            });
        }
        console.log("Personaje seleccionado:", character.name);

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            console.log("GEMINI_API_KEY no configurada");
            return res.status(500).json({
                error: "GEMINI_API_KEY no configurada"
            })
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model:"gemini-1.5-flash"});
        
        console.log("Cantidad de mensajes enviados:", messages.length);
        console.log("Mensajes enviados:", messages);

        const conversationText = messages
        .map(m => `${m.role}: ${m.content}`)
        .join("\n");

        const prompt = `
        ${character.system}
        
        Conversación:
        ${conversationText}
        `;

        console.log("Prompt generado:", prompt);
        console.log("Llamando a Gemini...");

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Texto final recibido de Gemini:", text);

        return res.status(200).json({ reply: text });
    } catch (error) {
        console.error("ERROR REAL:", error);
        console.error("STACK:", error?.stack);

        return res.status(500).json({
            error: error.message,
            details: error.toString()
        });
    }
}