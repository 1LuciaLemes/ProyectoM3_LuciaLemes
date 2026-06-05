import { getLastTenMessages } from "./services/chatService.js";

export function normalizePath(path) {
    return path.length > 1 ? path.replace(/\/$/, "") : path;
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
