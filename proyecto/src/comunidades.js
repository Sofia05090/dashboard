// src/comunidades.js

export function cargarComunidades() {
  const container = document.getElementById("comunidadesList");
  if (!container) return;

  const comunidades = [
    { nombre: "Programación", miembros: "42.5K" },
    { nombre: "Tecnología", miembros: "120K" },
    { nombre: "Gaming", miembros: "98K" },
    { nombre: "Noticias", miembros: "340K" }
  ];

  container.innerHTML = comunidades.map(c => `
    <div class="com-item">
      <h3>${c.nombre}</h3>
      <p>${c.miembros} miembros</p>
    </div>
  `).join("");
}
