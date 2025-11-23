

document.addEventListener("DOMContentLoaded", () => {
    const homeContainer = document.getElementById("homeView");

    if (!homeContainer) {
        console.warn('Falta <section id="homeView"></section> en tu HTML');
        return;
    }

    // Contenido tipo timeline de Twitter
    const tweetsEjemplo = [
        {
            usuario: "usuario1",
            texto: "¡Bienvenido a tu MVP tipo Twitter!",
            hora: "2h"
        },
        {
            usuario: "usuario2",
            texto: "Construyendo una app con Supabase 🔥",
            hora: "5h"
        },
        {
            usuario: "usuario3",
            texto: "Este es tu timeline inicial.",
            hora: "1d"
        }
    ];

    homeContainer.innerHTML = tweetsEjemplo.map(t => `
        <div class="tweet-item">
            <strong>@${t.usuario}</strong>
            <p>${t.texto}</p>
            <span>${t.hora}</span>
        </div>
    `).join("");
});
