export function renderAbout () {
    const app = document.querySelector("#app");
    app.innerHTML =`
    <div class="nosotros">
        <h2>Sobre Nosotros</h2>
      <p>
        Hola, soy Lucía. Esta aplicación te permite chatear con tres personajes icónicos del mundo de Harry Potter: 
        Hermione Granger, Rubeus Hagrid y los hermanos Fred y George Weasley. Cada personaje tiene su propia personalidad 
        gracias a la inteligencia artificial, que sigue un “prompt system” para que cada conversación se sienta auténtica 
        y característica de cada uno.
      </p>
      <p>
        Puedes elegir con quién hablar, disfrutar de sus respuestas únicas y explorar un chat interactivo que hace que la 
        experiencia sea divertida y personalizada. ¡Sumérgete en el mundo mágico y conversa con tus personajes favoritos!
      </p>
      <p>
        Cada personaje tiene una pequeña descripción: Hermione es inteligente y lógica, Hagrid es cariñoso y protector, 
        y los Gemelos Weasley son bromistas y traviesos. ¡Elige tu personaje y comienza a chatear!
      </p>
    </div>
    `
}