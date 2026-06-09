import { renderHome } from "./views/home.js";
import { renderChat } from "./views/chat.js";
import { renderAbout } from "./views/about.js";
import { renderNotFound } from "./views/notfound.js";
import { normalizePath } from "./utils.js";

const routes = {
    "/": renderHome,
    "/chat": renderChat,
    "/about": renderAbout,
};

export function router () {
    const path = normalizePath(window.location.pathname);
    const render = routes[path] || renderNotFound;

    render ();

    updateActiveLink();
    updateRouteBadge(path);
}

// navigateTo para navegar en la página, no renderizo si estoy en
// la misma y guardo el historial por si hago back/forward
export function navigateTo(path) {
    if(path === normalizePath(window.location.pathname)) return;

    history.pushState(null, "", path);
    router();
}

// Recorre todos los link y les pone o quita la clase active
// (si están o no clickeados actualmente)
function updateActiveLink() {
  const currentPath = normalizePath(window.location.pathname);

  document.querySelectorAll(".navbar__links a").forEach((link) => {
    const linkPath = normalizePath(link.getAttribute("href"));
    link.classList.toggle("active", linkPath === currentPath);
  });
}

// badge que nos dice en qué ruta estamos
export function updateRouteBadge(path) {
  let badge = document.querySelector(".route-badge");
  if (!badge) {
    badge = document.createElement("div");
    badge.className = "route-badge";
    document.body.appendChild(badge);
  }
  badge.innerHTML = `ruta activa: <span>${path}</span>`;
}