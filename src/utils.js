// -- UTILS DE CHAT --
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

// Borrar todo el historial
export function resetHistory() {
  historyChat.Hermione.messages = [];
  historyChat.Hagrid.messages = [];
  historyChat.Gemelos.messages = [];
}

// - Agregar el mensaje del usuario al chat (push)
export function addUserMessage (text, character) {
  if (!text?.trim()) return; //Si el texto es un espacio, no lo agrega como mensaje

  console.log(character);
  historyChat[character.key].messages.push({
    role: "user", 
    content: text
  });
}
  
  // - Agregar la respuesta al chat (push)
export function addIAMessage (text, character) {
  historyChat[character.key].messages.push({
    role: "model", 
    content: text
  });
}
  
// Guardo el personaje de forma global para poder mantener el historial anterior
// en caso de directamente renderizar el chat
export let currentCharacter = null;
  
export function setCurrentCharacter(character) {
  currentCharacter = character;
}
  
  // -- FUNCIONES DE UI/RENDERIZADO
export function normalizePath(path) {
    return path.length > 1 ? path.replace(/\/$/, "") : path;
}
  
export function showTyping() {
  const container = document.querySelector(".chat-messages");
  
  // evita duplicarlo si ya existe
  if (document.querySelector("#typing")) return;
  
  container.innerHTML += `
    <div class="message message--bot typing" id="typing">
      Escribiendo...
    </div>
  `;
  
  container.scrollTop = container.scrollHeight;
}
  
export function removeTyping() {
  const typing = document.querySelector("#typing");
  if (typing) typing.remove();
}
  
// Cargo los mensajes en el chat, sean enviados o recibidos
export function renderMessages(character) {
  const container = document.querySelector(".chat-messages");
  const messages = getLastTenMessages(character); // toma siempre del historial
    
  if (!messages) return;
    
  container.innerHTML = messages
    .map(msg => `
      <div class="message message--${msg.role === "user" ? "user" : "bot"}">
      ${msg.content}
      </div>
      `)
      .join("");
      
      container.scrollTop = container.scrollHeight;
  }