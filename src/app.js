import { router } from "./router.js";
import { setupLinkInterception, setupPopstateListener } from "./navigation.js";

setupLinkInterception();
setupPopstateListener();
router();
console.log("APP JS CARGADO");

// Cambio de tema
const btn = document.querySelector(".changeTheme");

if (btn) {
  btn.addEventListener("click", () => {
    document.body.classList.toggle("light");

    const isLight = document.body.classList.contains("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}

// default: oscuro
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light");
} else {
  document.body.classList.remove("light");
}