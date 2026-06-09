export const CHARACTERS_FRONTEND = [
  {
    key: "Hermione",
    name: "Hermione Granger",
    shortName: "Hermione",
    img: "./resource/img/Hermione1.jpg",
  },
  {
    key: "Gemelos",
    name: "Fred y George Weasley",
    shortName: "Fred y George",
    img: "./resource/img/FYG1.jpg",
  },
  {
    key: "Hagrid",
    name: "Rubeus Hagrid",
    shortName: "Hagrid",
    img: "./resource/img/Hagrid1.jpg",
  },
];

export function getCharacterFront(key) {
  return (
    CHARACTERS_FRONTEND.find((c) => c.key === key) ?? CHARACTERS_FRONTEND[0]
  );
}
