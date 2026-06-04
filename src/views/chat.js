import { renderHome } from "./home.js";
import { getCharacter } from "../payload.js";
import { getAllMessages,addUserMessage, addIAMessage, getLastTenMessages, sendMessage } from "../services/chatService.js";
import { renderMessages } from "../utils.js";
import { currentCharacter, setCurrentCharacter } from "../services/chatService.js";

export function renderChat(character) {
  //Sino viene un personaje seleccionado del home, uso el último que se guardó, y sino, hermione
  character = character || currentCharacter || getCharacter("Hermione");
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
  `;
  
  const input = document.querySelector("#chatInput");
  const sendButton = document.querySelector("#chatSend");

  //Al hacer click en el boton "enviar" estoy añadiendo el mensaje al historial y recibiendo el de respuesta
  sendButton.addEventListener("click", async () => {
    const text = input.value.trim();
    console.log(text);
    if (!text) return;
    input.value = "";

    // Recibe el mensaje del usuario y lo guarda y guarda el mensaje de la respuesta
    const reply = await sendMessage(text, character);

    // mostramos el mensaje
    renderMessages(character);
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendButton.click();
  });

  renderMessages(character);
}
