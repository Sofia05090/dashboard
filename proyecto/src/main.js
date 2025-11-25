import { supabase } from './supabase.js';
import { mostrarRegistro } from './registro.js';
import { mostrarLogin } from './login.js';
import { mostrarMVP } from './mvp.js';
import { mostrarUser } from './user.js';
import { mostrarAdmin } from './admin.js';

const routes = {
  registro: mostrarRegistro,
  login: mostrarLogin,
  actividades: mostrarMVP,
  usuarios: mostrarUser,
  admin: mostrarAdmin
};

async function CerrarSesion() {
  await supabase.auth.signOut();
  await cargarMenu();
  mostrarRegistro();
}

export async function cargarMenu() {
  const menu = document.getElementById('menu');
  if (!menu) return;

  const { data } = await supabase.auth.getUser();
  const user = data?.user || null;

  if (!user) {
    menu.innerHTML = `
      <div>
        <button data-action="registro">Registrarse</button>
        <button data-action="login">Iniciar sesión</button>
      </div>
    `;
  } else {
    menu.innerHTML = `
      <nav class="bottom-menu">
        <button class="nav-item" data-action="actividades">🏠</button>
        <button class="nav-item" data-action="buscar">🔍</button>
        <button class="nav-item" data-action="comunidades">🧭</button>
        <button class="nav-item" data-action="notificaciones">🔔</button>
        <button class="nav-item" data-action="mensajes">✉️</button>

        ${user.email === "juan.rodriguezr@uniagustiniana.edu.co" ? `

          <button class="nav-item" data-action="admin">👑</button>
        ` : ''}

        <button class="nav-item" data-action="logout">🚪</button>
      </nav>

      <div id="viewContainer"></div>
    `;
  }

  menu.querySelectorAll("[data-action]").forEach(btn => {
    const action = btn.dataset.action;

    if (action === "logout") {
      btn.addEventListener("click", e => {
        e.preventDefault();
        CerrarSesion();
      });
      return;
    }

    if (routes[action]) {
      btn.addEventListener("click", e => {
        e.preventDefault();
        routes[action]();
      });
      return;
    }

    btn.addEventListener("click", e => {
      e.preventDefault();
      cargarVista(action);
    });
  });
}

function cargarVista(vista) {
  const container = document.getElementById("viewContainer");
  if (!container) return;

  switch (vista) {
    case "buscar":
      container.innerHTML = `
        <h2>Buscar</h2>
        <input id="searchInput" placeholder="Buscar...">
        <div id="searchResults"></div>
      `;
      iniciarBuscador();
      break;

    case "comunidades":
      container.innerHTML = `
        <h2>Comunidades</h2>
        <div id="comunidadesList"></div>
      `;
      cargarComunidades();
      break;

    case "notificaciones":
      container.innerHTML = `
        <h2>Notificaciones</h2>
        <div id="notiList"></div>
      `;
      cargarNotificaciones();
      break;

    case "mensajes":
      container.innerHTML = `
        <h2>Mensajes</h2>
        <div id="dmList"></div>
      `;
      cargarDMs();
      break;
  }
}

function iniciarBuscador() {
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = q.length ? `<p>Resultados para <b>${q}</b></p>` : "";
  });
}

function cargarComunidades() {
  const cont = document.getElementById("comunidadesList");
  const items = ["Programación", "Gaming", "Noticias", "Tecnología"];
  cont.innerHTML = items.map(i => `<div class="item">${i}</div>`).join("");
}

function cargarNotificaciones() {
  const cont = document.getElementById("notiList");
  cont.innerHTML = `
    <div class="item">Te dieron like</div>
    <div class="item">Nuevo seguidor</div>
    <div class="item">Tu tweet está creciendo</div>
  `;
}

function cargarDMs() {
  const cont = document.getElementById("dmList");
  cont.innerHTML = `
    <div class="item"><b>Juan:</b> ¿Qué tal?</div>
    <div class="item"><b>Ana:</b> ¿Hacemos call?</div>
    <div class="item"><b>Luis:</b> Mira esto...</div>
  `;
}

document.addEventListener('DOMContentLoaded', cargarMenu);
