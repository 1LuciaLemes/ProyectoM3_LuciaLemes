import { router } from "./router.js";
import { setupLinkInterception, setupPopstateListener } from "./navigation.js";

setupLinkInterception();
setupPopstateListener();
router();
console.log("APP JS CARGADO");

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