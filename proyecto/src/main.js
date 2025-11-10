// ...existing code...
import { supabase } from './supabase.js';
import { mostrarRegistro } from './register.js';
import { mostrarLogin } from './login.js';
import { mostrarMVP } from './mvp.js';
import { mostrarUser } from './user.js';
import { mostrarAdmin } from './admin.js';

// Funciones de navegación disponibles para ser llamadas
const routes = {
  'registro': mostrarRegistro,
  'login': mostrarLogin,
  'actividades': mostrarMVP,
  'usuarios': mostrarUser,
  'admin': mostrarAdmin
};

async function CerrarSesion() {
  await supabase.auth.signOut();
  await cargarMenu();
  mostrarRegistro();
}

export async function cargarMenu() {
  const menu = document.getElementById('menu');
  if (!menu) {
    console.warn('Elemento "#menu" no encontrado. Añade <div id="menu"></div> en tu HTML o carga el script después del DOM.');
    return;
  }

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
      <div>
        <button data-action="actividades">Actividades</button>
        <button data-action="usuarios">Usuarios</button>
        <button data-action="logout">Cerrar sesión</button>
        ${user.email === 'admin@mail.com' ? '<button data-action="admin">Admin</button>' : ''}
      </div>
    `;
  }

  menu.querySelectorAll('button').forEach(button => {
    const action = button.getAttribute('data-action');
    if (!action) return;
    if (action === 'logout') {
      button.addEventListener('click', (e) => { e.preventDefault(); CerrarSesion(); });
    } else if (routes[action]) {
      button.addEventListener('click', (e) => { e.preventDefault(); routes[action](); });
    }
  });
}

document.addEventListener('DOMContentLoaded', cargarMenu);