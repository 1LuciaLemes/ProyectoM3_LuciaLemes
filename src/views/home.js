import { renderChat } from "./chat.js";
import { getCharacterFront } from "./characters.js";
import { updateRouteBadge } from "../router.js";
import { setCurrentCharacter } from "../utils.js";

export function renderHome () {

  const app = document.querySelector("#app");
  const characters = [
    { name: "Hermione Granger", key: "Hermione", img: "./resource/img/HG.jpg" },
    { name: "Rubeus Hagrid", key: "Hagrid", img: "./resource/img/HG.jpg" },
    { name: "Fred y George Weasley", key: "Gemelos", img: "./resource/img/HG.jpg" }
  ]

  app.innerHTML = `
    <div class="view">
      <div>
        <p>Comienza a chatear, elige tu personaje favorito!</p>
      </div>

      <div class="main-container">

        <div class="view">
          <div class="character-container" data-key="Hermione">
            <div class="character-image">
              <img src="./resource/img/HG.jpg" alt="imagen del personaje">
            </div>
            <div class="character-name">Nombre del Personaje 1</div>
          </div>
        </div>

        <div class="view">
          <div class="character-container" data-key="Hagrid">
            <div class="character-image">
              <img src="./resource/img/HG.jpg" alt="imagen del personaje">
            </div>
            <div class="character-name">Nombre del Personaje 2</div>
          </div>
        </div>

        <div class="view">
          <div class="character-container" data-key="Gemelos">
            <div class="character-image">
              <img src="./resource/img/HG.jpg" alt="imagen del personaje">
            </div>
            <div class="character-name">Nombre del Personaje 3</div>
          </div>
        </div>

      </div>
    </div>
  `;

  const conteiner = document.querySelector(".main-container");
// Busco el contenedor del personaje para poder agregar la función de que 
// se pueda hacer click en el contenedor del personaje, sea la imagen, 
// o el nombre para poder ir directo a su chat, con su payload cargado.
  conteiner.addEventListener("click", function(event) {
    const character = event.target.closest(".character-container");
    if(!character) return;

    const key = character.dataset.key; // Obtiene la clave del personaje clickeado
    const characterPayload = getCharacterFront(key); // Devuelve el objeto del personaje con nombre, key e imagen
    setCurrentCharacter(characterPayload); // Guarda el personaje seleccionado globalmente
    renderChat(characterPayload); // Muestra la vista del chat con ese personaje

    //Actualizo la url cuando voy al chat
    history.pushState({ character: key }, "", "/chat");
    updateRouteBadge("/chat");
    console.log("elegiste el", {characters: key});
  });
}
