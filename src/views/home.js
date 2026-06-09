import { renderChat } from "./chat.js";
import { getCharacterFront, CHARACTERS_FRONTEND } from "./characters.js";
import { updateRouteBadge } from "../router.js";
import { setCurrentCharacter } from "../utils.js";

export function renderHome() {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="view">
      <div class="title">
        <p>Comienza a chatear, elige tu personaje favorito!</p>
      </div>

      <div class="main-container">
        ${CHARACTERS_FRONTEND.map(
          (c) => `
          <div class="view">
            <div class="character-container" data-key="${c.key}">
              <div class="character-image">
                <img src="${c.img}" alt="imagen de ${c.name}">
              </div>
              <div class="character-name"
                data-mobile="${c.name}"
                data-desktop="${c.shortName}">
              </div>
            </div>
          </div>
        `,
        ).join("")}
      </div>
    </div>
  `;

  const conteiner = document.querySelector(".main-container");
  // Busco el contenedor del personaje para poder agregar la función de que
  // se pueda hacer click en el contenedor del personaje, sea la imagen,
  // o el nombre para poder ir directo a su chat, con su payload cargado.
  conteiner.addEventListener("click", function (event) {
    const character = event.target.closest(".character-container");
    if (!character) return;

    const key = character.dataset.key; // Obtiene la clave del personaje clickeado
    const characterPayload = getCharacterFront(key); // Devuelve el objeto del personaje con nombre, key e imagen
    setCurrentCharacter(characterPayload); // Guarda el personaje seleccionado globalmente
    renderChat(characterPayload); // Muestra la vista del chat con ese personaje

    //Actualizo la url cuando voy al chat
    history.pushState({ character: key }, "", "/chat");
    updateRouteBadge("/chat");
    console.log("elegiste el", { characters: key });
  });

  document.addEventListener("click", (e) => {
    if (e.target.matches(".navbar__links a")) {
      document
        .querySelectorAll(".navbar__links a")
        .forEach((el) => el.classList.remove("active"));
      e.target.classList.add("active");
    }
  });
}
