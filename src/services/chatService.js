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

// Inicializa el array que contiene los mensajes del chat de cada personaje
const historyChat = {
    Hermione: { messages: [] },
    Hagrid: { messages: [] },
    Gemelos: { messages: [] }
};

// Trae todo el historial
export function getAllMessages(character) {
    return historyChat[character.key].messages;
}

// - Mantener el historial de conversación en memoria, cargarlo si ya tiene, que cargue los ultimos
// 10 mensajes o algo asi (es un get que trae los mensajes anteriores)
export function getLastTenMessages(character) {
    return historyChat[character.key].messages.slice(-10);
}

// - Agregar el mensaje del usuario al chat (push)
export function addUserMessage (text, character) {
    console.log(character);
    historyChat[character.key].messages.push({
        role: "user", 
        content: text
    });
}

// - Agregar la respuesta al chat (push)
export function addIAMessage (text, character) {
    historyChat[character.key].messages.push({
        role: "IA", 
        content: text
    });
}

// Guardo el personaje de forma global para poder mantener el historial anterior
// en caso de directamente renderizar el chat
export let currentCharacter = null;

export function setCurrentCharacter(character) {
    currentCharacter = character;
}