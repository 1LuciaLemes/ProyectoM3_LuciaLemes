// - Enviar el mensaje del usuario y recibir una respuesta de la IA
// - Enviar mensajes al backend (es el fetch)
export async function sendMessage(message, character) {
  addUserMessage(message, character);

  const mockResponse = `Respuesta simulada de ${character.name}`;

  addIAMessage(mockResponse, character);

  return mockResponse;
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