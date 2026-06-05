// renderStatus.js
import { getState } from '../state.js';
import { renderMessages, showTyping, removeTyping} from '../utils.js';
import { currentCharacter, setCurrentCharacter } from '../services/chatService.js';


export function setStatus() {
  const state = getState();

  const error = document.querySelector("#error");
  const errorMessage = document.querySelector("#error-message");
  const sendButton = document.querySelector("#chatSend");
  const input = document.querySelector("#chatInput");

  if (state.status === "loading") {
    error.classList.add("hidden");

    // Bloquo el input y el botón
    sendButton.disabled = true;
    input.disabled = true;

    showTyping();

  } else if (state.status === "success") {
    error.classList.add("hidden");

    // Desbloquo el input y el botón
    sendButton.disabled = false;
    input.disabled = false;

    // Renderizo mensajes
    renderMessages(currentCharacter);
    removeTyping();

  } else if (state.status === "error") {
    error.classList.remove("hidden");
    errorMessage.textContent = state.error;

    // Desbloquo el input y el botón para reintentar
    sendButton.disabled = false;
    input.disabled = false;

    removeTyping();
  }
}