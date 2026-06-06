import { getLastTenMessages, addIAMessage, addUserMessage } from "../utils";
// - Enviar el mensaje del usuario y recibir una respuesta de la IA
// - Enviar mensajes al backend (es el fetch)
export async function sendMessage(message, character) {
    addUserMessage(message, character);

   try {
    // Llamo a la serverless function
    const res = await fetch("/api/functions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        characterKey: character.key,
        messages: getLastTenMessages(character)
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Error en la API");
    }

    const data = await res.json();
    const reply = data.reply;

    addIAMessage(reply, character);

    return reply;

  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Error enviando mensaje a Gemini");
  }
}