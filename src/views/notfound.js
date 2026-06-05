export function renderNotFound () {
    const app = document.querySelector("#app");
    return app.innerHTML = `
    <section class = "notfound">
        <h1>404</h1>
        <p>Página no encontrada</p>
        <a href="/home" data-link>Volver al inicio</a>
    </section>
    `
}