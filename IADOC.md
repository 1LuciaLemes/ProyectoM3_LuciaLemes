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
## Realización del README:
**prompt:**
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