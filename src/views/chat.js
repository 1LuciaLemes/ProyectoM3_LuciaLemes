import { getCharacterFront, CHARACTERS_FRONTEND } from "./characters.js";
import { sendMessage } from "../services/chatService.js";
import {
  getAllMessages,
  addUserMessage,
  addIAMessage,
  getLastTenMessages,
  renderMessages,
  currentCharacter,
  setCurrentCharacter,
  showTyping,
  removeTyping
} from "../utils.js";

import { getState, setState } from "../state.js";
import { setStatus } from "./setStatus.js";

export function renderChat(character) {
  //Sino viene un personaje seleccionado del home, uso el último que se guardó, y sino, hermione
  const fallback = getCharacterFront("Hermione");

  const resolvedCharacter =
    character ??
    currentCharacter ??
    fallback;

  if (!resolvedCharacter || !resolvedCharacter.key) {
    console.error("Character inválido:", resolvedCharacter);
    return;
  }

  setCurrentCharacter(resolvedCharacter);

  character = resolvedCharacter;

  const app = document.querySelector("#app");

  app.innerHTML = `
  <div class="view-chat">
    <p style="margin-top:1rem"><a href="/" class="link">← Home</a></p>

    <div class="chat-window">
      <div class="chat-topbar">
        ${CHARACTERS_FRONTEND.map(
          (c) => `
            <button class="character-tab ${c.key === character.key ? "active" : ""}" data-key="${c.key}">
              ${c.name}
            </button>
          `,
        ).join("")}
      </div>

      <div class="chat-messages">
      </div>

      <div class="chat-input-row">
        <input id="chatInput" class="chat-input" placeholder="Escribe un mensaje...">
        <button id="chatSend" class="chat-send">Enviar</button>
      </div>

    </div>

    <!-- Estado de error -->
    <div id="error" class="error hidden">
      <p id="error-message"></p>
    </div>
  `;

  const topbar = document.querySelector(".chat-topbar");

  topbar.addEventListener("click", (e) => {
    const button = e.target.closest(".character-tab");
    if (!button) return;

    const key = button.dataset.key;
    if (!key || key === character.key) return;

    const newCharacter = getCharacterFront(key);

    setCurrentCharacter(newCharacter);

    history.pushState({ character: key }, "", "/chat");

    renderChat(newCharacter);
  });

  //Lógica del chat
  const input = document.querySelector("#chatInput");
  const sendButton = document.querySelector("#chatSend");

  //Evita múltiples requests simultáneos
  let isSending = false;

  //Al hacer click en el boton "enviar" estoy añadiendo el mensaje al historial y recibiendo el de respuesta
  sendButton.addEventListener("click", async () => {
    const text = input.value.trim();
    console.log(text);
    if (!text || isSending) return;

    input.value = "";
    isSending = true;

    // 1️⃣ Agregar mensaje del usuario al historial y renderizarlo
  addUserMessage(text, character);
  renderMessages(character);

  // 2️⃣ Mostrar "Escribiendo..." mientras llega la respuesta
  showTyping();

    //Cambio estado a loading
    setState({ status: "loading" });
    setStatus();

    try {
      // 3️⃣ Esperar la respuesta de la IA
    const response = await sendMessage(text, character);

    // 4️⃣ Quitar "Escribiendo..." y agregar la respuesta al historial
    removeTyping();
    addIAMessage(response, character);

    renderMessages(character);
      setState({
        status: "success",
        data: character,
      });

      setStatus();
    } catch (err) {
      setState({
        status: "error",
        error: err.message,
      });

      setStatus();
    } finally {
      isSending = false;
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendButton.click();
  });

  // Render inicial del chat
  renderMessages(character);
}
