[Volver al README](README.md)

# Uso de IA y documentación

## Introducción

Breve explicación del objetivo de esta documentación: detallar cómo se integra Google Gemini en el proyecto, cómo se estructuran los prompts y cómo funciona la comunicación con el backend.

## ChatService
**Prompt 1:** 
```
Contexto:
Estoy trabajando en una SPA donde implemento un chat que interactúa con tres personajes ficticios (Hermione, Hagrid y Fred y George). Por ahora los personajes son estáticos, pero luego se integrará IA para que respondan dinámicamente.
Se parte de una estructura inicial donde historyChat es un array único que almacena todos los mensajes del chat sin distinguir entre personajes. La aplicación permite interactuar con múltiples personajes ficticios, por lo que este enfoque genera mezcla de conversaciones.

Objetivo:
¿Cómo puedo reorganizar esta estructura para que cada personaje mantenga su propio chat sin mezclar los mensajes?
Incluye una propuesta de estructura de datos y ejemplos de cómo agregar y recuperar mensajes por personaje.
Explica tu respuesta, y proporciona el código respectivo.
```
**Respuesta:**
Para manejar varios personajes de forma funcional, en lugar de tener un solo array chatHistory, puedes usar un objeto donde cada clave sea el nombre o ID del personaje, y el valor sea su historial de mensajes:
```js
const historyChat = {
  hermione: [],
  hagrid: [],
  fredGeorge: []
};
```
Cuando un usuario envía un mensaje, agregas el mensaje al array correspondiente al personaje activo:
```js
historyChat[character].push({
  role: "user",
  content: userMessage
});
```
Y al recibir la respuesta de la IA:
```js
historyChat[character].push({
  role: "model",
  content: iaResponse
});
```
De esta manera, cada personaje mantiene su historial independiente. Cuando cambias de personaje, solo accedes al array correspondiente sin que se mezclen los chats de otros personajes. Esto simplifica la lógica de renderizado y mantiene la coherencia de la conversación.

**Prompt 2:** 
```
Contexto:  
Estoy trabajando en una SPA donde los usuarios pueden interactuar con varios personajes ficticios mediante un chat. Cada personaje tiene su historial propio (según la solución del Prompt 1).  
La aplicación tiene varias secciones (Home, Header, Chat) desde las cuales se puede acceder al chat del personaje. Quiero asegurar que, al navegar entre vistas, siempre se mantenga el último chat y el personaje activo.

Objetivo:  
¿Cómo puedo gestionar el personaje activo de forma que su estado se mantenga globalmente en la aplicación y se pueda acceder al historial correspondiente desde cualquier sección?  
Incluye una propuesta de implementación y explica cómo se maneja el contexto de navegación.
```
**Respuesta:**
Para mantener el personaje activo y su contexto a lo largo de toda la aplicación, se define character como estado global:
```js
let currentCharacter = null;

export function setCurrentCharacter(character) {
  currentCharacter = character;
}

export function getCurrentCharacter() {
  return currentCharacter;
}
```
Esto permite:

- Mantener el personaje seleccionado aunque cambie la vista.
- Acceder al mismo chat desde Home, Header o Chat.
- Evitar perder contexto al navegar con History API.

## Serveless function
**Prompt:**
```
Contexto:
Estoy trabajando en una SPA con chat por personajes ficticios (Hermione, Hagrid, Fred y George).  
Cada personaje tiene su propio historial de chat (según Prompt 1) y se mantiene el personaje activo globalmente (según Prompt 2).  
Se dispone de una función serverless que envía mensajes al backend y recibe la respuesta de la IA.  

Código inicial:
const conversationText = messages
  .map(m => `${m.role}: ${m.content}`)
  .join("\n");

const prompt = `
${character.system}

Conversación:
${conversationText}
`;

console.log("Prompt generado:", prompt);

const result = await model.generateContent({
    contents: [
        { role: "user", parts: [{ text: prompt }] }
    ]
});

Problema: Este enfoque genera problemas de escalabilidad, mezcla de roles y dificultad para mantener el historial por personaje.

Objetivo:  
Reorganizar la función serverless para enviar el historial de manera estructurada, utilizando `contents` como array de mensajes, de forma que Gemini interprete correctamente cada mensaje y rol.  
Incluye la propuesta de implementación y explica por qué este enfoque es mejor que la concatenación de strings.
```
**Respuesta:**
En tu versión se construía un string concatenado (conversationText) y un prompt combinando el system prompt con todo el historial:

Este enfoque fue reemplazado porque la API de Gemini funciona mejor recibiendo un array de mensajes (contents) en lugar de un string gigante.

Implementación actual:
```js
const contents = [
  // Primer mensaje: system del personaje
  { role: "user", parts: [{ text: character.system }] },
  // Mensajes previos del chat
  ...messages.map(m => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }]
  }))
];
console.log("Contents enviados a Gemini:", contents);

const result = await model.generateContent({ contents });
```

Ventajas de este cambio:

- Mantiene el historial de chat por personaje de manera clara.
- Gemini interpreta mejor la estructura de mensajes que un string concatenado.
- Reduce la complejidad del código y mejora la escalabilidad.
- Evita duplicación de lógica y concatenaciones manuales.
- Flujo de la función serverless
- Se recibe el mensaje del usuario desde el frontend.
- Se construye el array contents incluyendo el system prompt del personaje y el historial de mensajes previos.
- Se envía contents a la API de Google Gemini usando model.generateContent.
- Se devuelve la respuesta al frontend para que se renderice en la interfaz de chat.

## Pormpt system personajes:
**Prompt:**
```
Contexto: Estoy desarrollando una SPA con personajes ficticios impulsados por IA (Hermione Granger, Hagrid y los Gemelos 
Weasley). Necesito limitar la longitud de las respuestas para que sean adecuadas para una interfaz de chat y evitar 
respuestas excesivamente largas. Estoy usando gemini-2.5-flash con max tokens: 200.

Objetivo:
Lograr que cada personaje responda con un máximo de 100 palabras, manteniendo respuestas breves, coherentes y acordes
a una conversación de chat.
```
**Respuesta:**
Sí, para este proyecto es una muy buena idea agregar una instrucción explícita en cada system prompt, porque 
max_tokens: 200 no garantiza que la respuesta tenga menos de 100 palabras. Los tokens y las palabras no son equivalentes.

Te recomiendo utilizar una constante compartida para no repetir:
```js
const RESPONSE_RULES = `
Mantén las respuestas breves para un chat.
No superes las 100 palabras por respuesta.
La mayoría de las respuestas deben tener entre 30 y 80 palabras.
`;
```

## Estilo CSS y funcionalidades aplicadas a estilo:
### 1. Cambio de temas, claro/ocurso:
**Prompt:**
```
Estoy realizando una SPA y quiero poder cambiar estéticamente el tema de oscuro a claro.
Simplemente quiero que se intercambien los colores.

Necesito que me expliques:

- Cómo debería añadirse en el código lógico con JavaScript para cambiar el tema al hacer clic en un botón.
- Cómo puedo guardar la preferencia del usuario para que cuando recargue la página siga viendo el tema elegido.
- Cómo organizar los colores usando variables CSS (:root) para el tema oscuro y body.light para el tema claro.
- Ejemplo simple de CSS y JS que haga que funcione todo junto.
```
**Respuesta**
Te doy un ejemplo de cómo debes hacer, define primero los colores de tu tema oscuro por defecto en :root y los colores del tema claro en body.light:
```js
/* Tema oscuro por defecto */
:root {
  --bg-color: #1e1e1e;
  --text-color: #ffffff;
  --accent-color: #f0c674;
}

/* Tema claro */
body.light {
  --bg-color: #ffffff;
  --text-color: #1e1e1e;
  --accent-color: #ffcc00;
}

/* Aplica las variables a tu app */
body {
  background-color: var(--bg-color);
  color: var(--text-color);
}

button {
  background-color: var(--accent-color);
  color: var(--text-color);
}
```
En el código JavaScript tienes que agregar lo siguiente:
```js
// Recupera el tema guardado o usa oscuro por defecto
const savedTheme = localStorage.getItem("theme") || "dark";
document.body.classList.toggle("light", savedTheme === "light");

// Botón para cambiar el tema
const btn = document.querySelector(".changeTheme");
if (btn) {
  btn.addEventListener("click", () => {
    // Alterna la clase 'light'
    const isLight = document.body.classList.toggle("light");

    // Guarda la preferencia en localStorage
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}
```
### 2. Transformación del nombre de los personajes en /home
**Prompt:**
```
Quiero mostrar un texto en HTML de manera vertical, como si cada letra estuviera apilada de arriba hacia abajo.

No sé qué propiedad CSS usar para esto.

Necesito que me expliques:

- Cómo lograrlo con CSS puro, sin separar cada letra manualmente ni usar JavaScript para dividir el texto.
- Qué propiedades CSS permiten que el texto se muestre en vertical como en un cartel o título.
- Un ejemplo simple de HTML y CSS que funcione para cualquier palabra o frase.
```
**Respuesta:**
Para lograr que un texto se muestre en vertical (una letra debajo de la otra) puedes hacerlo directamente con CSS, sin necesidad de separar las letras ni usar JavaScript.

La forma más simple es usando una propiedad de CSS que permite cambiar la dirección en la que se escribe el texto.
HTML:
```html
<p class="vertical-text">Hola Mundo</p>
```
CSS:
```css
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: upright;
}
```
- `writing-mode: vertical-rl;`<br>
Hace que el texto se escriba en vertical, de arriba hacia abajo.<br>
- `text-orientation: upright;`<br>
Hace que las letras se mantengan “derechas” y no giradas.

Respuesta visual aproximada:
```
H
o
l
a

M
u
n
d
o
```
### 3. Cambiar el hover del navbar cuando accedo al chat desde el personaje:
**Prompt:**
```
Estoy desarrollando una SPA en JavaScript sin frameworks.

En el home (/home) tengo un selector de personajes; al hacer clic en uno, navego al chat usando history.pushState.
También tengo un navbar con links (Home, Chat, etc.).

Necesito que:

- Cuando navego desde el home al chat, el link correspondiente del navbar se marque como activo (active), como si estuviera en hover o seleccionado.
- La solución funcione incluso si la navegación no viene de un click directo en el navbar, sino desde hacer click en un botón.
```
**Respuesta:**
El código proporcionado por la IA fue:
```js
history.pushState en home
document
  .querySelectorAll(".navbar__links a")
  .forEach((el) => el.classList.remove("active"));

const chatLink = document.querySelector('.navbar__links a[href="/chat"]');
if (chatLink) chatLink.classList.add("active");
```
## Realización del README:
**Prompt:**
``` 
Actúa como un experto en documentación de proyectos frontend.

Necesito que me generes SOLO la estructura inicial de un archivo README.md para un proyecto de Single Page Application (SPA) que utiliza una API de inteligencia artificial (Google Gemini) para un chat con un personaje ficticio.

Requisitos:
    - No escribas contenido final ni explicaciones largas.
    - Solo incluye:
    - Títulos en Markdown (ej: ## Tecnologías usadas)
    - Debajo de cada título, una breve descripción de 1 línea que explique qué debe ir en esa sección.
    - El objetivo es que sirva como plantilla para completar luego.
    - Usa un estilo claro, profesional y ordenado.
    - Incluye estas secciones obligatorias:
    - Título del proyecto
    - Demo / URL pública
    - Descripción del proyecto
    - Tecnologías usadas
    - Estructura del proyecto
    - Funcionalidades
    - Variables de entorno
    - Cómo ejecutar el proyecto
    - Tests
    - Personaje elegido / personalidad
    - Deploy
    - Decisiones técnicas
    - Uso de IA y documentación

Formato esperado:
    - Markdown limpio
    - Sin código innecesario
    - Sin ejemplos largos
    - Solo estructura + breve descripción por sección
```
**Respuesta:**
```
# Proyecto Integrador M3 - Chat IA

## Demo / URL pública
(acá debe ir un GIF o imagen que muestre cómo se ve y se usa la aplicación, además del enlace público en Vercel)

## Descripción del proyecto
(acá debe ir un resumen breve del proyecto: qué hace, objetivo principal y cómo funciona)

## Tecnologías usadas
(acá debe ir la lista de tecnologías, librerías y herramientas utilizadas en el desarrollo)

## Estructura del proyecto
(acá debe ir la organización de carpetas y archivos principales, ejemplo de árbol de directorios)

## Funcionalidades
(acá debe ir la lista de todas las funcionalidades implementadas en la aplicación)

## Variables de entorno
(acá debe ir la explicación de las variables de entorno necesarias, ejemplo `.env` y `.env.example`)

## Cómo ejecutar el proyecto
(acá debe ir la explicación de cómo clonar el repositorio y ejecutar únicamente los tests localmente, ya que la aplicación se despliega directamente en Vercel)

## Tests
(acá debe ir cómo ejecutar los tests, herramientas usadas y qué se testea)

## Personaje elegido / personalidad
(acá debe ir el personaje ficticio elegido y una breve descripción de su personalidad y estilo de conversación)

## Decisiones técnicas
(acá debe ir un resumen de las decisiones importantes de arquitectura, diseño y manejo de API)

## Uso de IA y documentación
(acá debe ir información sobre prompts utilizados, cómo se diseñó el system prompt y decisiones tomadas usando IA)
```
