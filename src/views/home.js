export function renderHome () {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="view">
      <div>
        <p>Comienza a chatear, elige tu personaje favorito!</p>
      </div>

      <div class="main-container">

        <div class="view">
          <div class="character-container">
            <div class="character-image">
              <img src="./resource/img/HG.jpg" alt="imagen del personaje">
            </div>
            <div class="character-name">Nombre del Personaje 1</div>
          </div>
        </div>

        <div class="view">
          <div class="character-container">
            <div class="character-image">
              <img src="./resource/img/HG.jpg" alt="imagen del personaje">
            </div>
            <div class="character-name">Nombre del Personaje 2</div>
          </div>
        </div>

        <div class="view">
          <div class="character-container">
            <div class="character-image">
              <img src="./resource/img/HG.jpg" alt="imagen del personaje">
            </div>
            <div class="character-name">Nombre del Personaje 3</div>
          </div>
        </div>

      </div>
    </div>
  `;
}