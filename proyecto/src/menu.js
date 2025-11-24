// src/menu.js
import { supabase } from './supabase.js';
import { mostrarLogin } from './login.js';
import { mostrarRegistro } from './registro.js';
import { mostrarMVP } from './mvp.js';
import { mostrarUser } from './user.js';

// IMPORTAR LAS SECCIONES DEL MENÚ
import { cargarBuscador } from './buscador.js';
import { cargarComunidades } from './comunidades.js';
import { cargarNotificaciones } from './notificaciones.js';
import { cargarMensajes } from './mensajes.js';

// Cerrar sesión
async function cerrarSesion() {
  await supabase.auth.signOut();
  await cargarMenu();
  mostrarLogin();
}

export async function cargarMenu() {
  const menu = document.getElementById('menu');
  if (!menu) return;

  // Obtener usuario actual
  const { data } = await supabase.auth.getUser();
  const user = data?.user || null;

  // Si no hay usuario → login/registro
  if (!user) {
    menu.innerHTML = `
      <div class="auth-buttons">
        <button data-action="registro">Registrarse</button>
        <button data-action="login">Iniciar sesión</button>
      </div>
    `;

    menu.querySelector('[data-action="registro"]').onclick = () => mostrarRegistro();
    menu.querySelector('[data-action="login"]').onclick = () => mostrarLogin();

    return;
  }

  // Si hay usuario → menú inferior
  menu.innerHTML = `
    <nav class="bottom-menu">
      <button class="nav-item" data-action="home">🏠</button>
      <button class="nav-item" data-action="buscar">🔍</button>
      <button class="nav-item" data-action="comunidades">🧭</button>
      <button class="nav-item" data-action="notificaciones">🔔</button>
      <button class="nav-item" data-action="mensajes">✉️</button>
      <button class="nav-item" data-action="perfil">👤</button>
      <button class="nav-item" data-action="logout">🚪</button>
    </nav>

    <div id="viewContainer"></div>
  `;

  // Asignar acciones a botones
  const botones = menu.querySelectorAll('[data-action]');

  botones.forEach(btn => {
    const action = btn.dataset.action;

    switch (action) {
      case 'logout':
        btn.onclick = cerrarSesion;
        break;

      case 'home':
        btn.onclick = () => mostrarMVP();
        break;

      case 'perfil':
        btn.onclick = () => mostrarUser();
        break;

      case 'buscar':
        btn.onclick = () => cargarVista('buscar');
        break;

      case 'comunidades':
        btn.onclick = () => cargarVista('comunidades');
        break;

      case 'notificaciones':
        btn.onclick = () => cargarVista('notificaciones');
        break;

      case 'mensajes':
        btn.onclick = () => cargarVista('mensajes');
        break;
    }
  });
}

// Cargar vistas secundarias
function cargarVista(vista) {
  const container = document.getElementById('viewContainer');
  if (!container) return;

  switch (vista) {
    case 'buscar':
      container.innerHTML = `
        <h2>Buscar</h2>
        <input id="searchInput" placeholder="Buscar...">
        <div id="searchResults"></div>
      `;
      cargarBuscador();
      break;

    case 'comunidades':
      container.innerHTML = `
        <h2>Comunidades</h2>
        <div id="comunidadesList"></div>
      `;
      cargarComunidades();
      break;

    case 'notificaciones':
      container.innerHTML = `
        <h2>Notificaciones</h2>
        <div id="notiList"></div>
      `;
      cargarNotificaciones();
      break;

    case 'mensajes':
      container.innerHTML = `
        <h2>Mensajes</h2>
        <div id="dmList"></div>
      `;
      cargarMensajes();
      break;
  }
}

document.addEventListener('DOMContentLoaded', cargarMenu);
