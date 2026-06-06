import { getCharacterFront } from "./characters.js";
import { sendMessage } from "../services/chatService.js";
import {
  getAllMessages,
  addUserMessage,
  addIAMessage,
  getLastTenMessages,
  renderMessages,
  currentCharacter
} from "../utils.js";

import { getState, setState } from "../state.js";
import { setStatus } from "./setStatus.js";

export function renderChat(character) {
  //Sino viene un personaje seleccionado del home, uso el último que se guardó, y sino, hermione
  character = character || currentCharacter || getCharacterFront("Hermione");

  const app = document.querySelector("#app");

  app.innerHTML = `
  <div class="view-chat">
    <p style="margin-top:1rem"><a href="/" class="link">← Home</a></p>

    <div class="chat-window">
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

    //Cambio estado a loading
    setState({ status: "loading" });
    setStatus();

    try {
       //Recibe el mensaje del usuario y lo guarda y guarda el mensaje de la respuesta
        await sendMessage(text, character);

        setState({
          status: "success",
          data: character
        });

        setStatus();

    } catch (err) {
        setState({
          status: "error",
          error: err.message
        });

        setStatus();

    } finally {
        isSending = false;
    }
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendButton.click();
  });

  // Render inicial del chat
  renderMessages(character);
}