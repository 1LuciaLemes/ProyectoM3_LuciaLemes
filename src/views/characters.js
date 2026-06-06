export const CHARACTERS_FRONTEND = [
  { key: "Hermione", name: "Hermione Granger", img: "./resource/img/HG.jpg" },
  { key: "Hagrid", name: "Rubeus Hagrid", img: "./resource/img/HG.jpg" },
  { key: "Gemelos", name: "Fred y George Weasley", img: "./resource/img/HG.jpg" }
];

export function getCharacterFront(key) {
  return CHARACTERS_FRONTEND.find(c => c.key === key) ?? CHARACTERS_FRONTEND[0];
}