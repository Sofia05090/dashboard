// =================================
// MENSAJES DIRECTOS (DMs) - X/Twitter
// =================================

document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("dmList");
    if (!container) return;

    const mensajes = [
        { usuario: "Juan", mensaje: "¿Viste lo último que publiqué?" },
        { usuario: "Luisa", mensaje: "¿Cuándo seguimos el proyecto?" },
        { usuario: "Carlos", mensaje: "Te mandé un archivo." }
    ];

    container.innerHTML = mensajes.map(m => `
        <div class="dm-item">
            <strong>${m.usuario}</strong>
            <p>${m.mensaje}</p>
        </div>
    `).join("");

});
