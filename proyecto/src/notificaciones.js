// =================================
// NOTIFICACIONES - TWITTER STYLE
// =================================

document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("notiList");
    if (!container) return;

    const notis = [
        "A alguien le gustó tu tweet",
        "Nuevo seguidor te agregó",
        "Tu publicación está siendo vista más de lo normal",
        "Una cuenta que sigues publicó un nuevo tweet"
    ];

    container.innerHTML = notis.map(n => `
        <div class="noti-item">
            <p>${n}</p>
        </div>
    `).join("");

});
