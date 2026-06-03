import { navigateTo, router } from "./router.js";

export function setupLinkInterception() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    // 2. Casos que NO interceptamos.
    // Ctrl/Cmd/Shift/Alt + click -> el usuario quiere nueva pestaña.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    // target="_blank" -> diseñado para abrir en otra pestaña.
    if (link.target === "_blank") return;
    // Diferente origin -> link externo, que navegue normalmente.
    if (link.origin !== window.location.origin) return;
    // Anclas (#seccion) -> scroll interno, no navegacioón.
    if (href.startsWith("#")) return;
    // Protocolos especiales -> los maneja el sistema operativo o el navegador.
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return;
    // Solo interceptamos rutas internas absolutas.
    if (!href.startsWith("/")) return;

    /* 3. calcelamos el comportamiento normal del navegador
    * con preventDefault y ejecutamos el navigateTo (que navegue)
    */
    event.preventDefault();
    navigateTo(href);
  });

}

// Re-renderizar según la URL actual, si fue back/forward
export function setupPopstateListener() {
  window.addEventListener("popstate", function () {
    router();
  });
}