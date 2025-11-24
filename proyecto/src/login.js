// src/login.js
import { supabase } from './supabase.js';
import { mostrarRegistro } from './registro.js';
import { mostrarMVP } from './mvp.js';
import { cargarMenu } from './menu.js';

export function mostrarLogin() {
  const app = document.getElementById('app');

  app.innerHTML = `
<section>
  <h2>Iniciar sesión</h2>

  <form id="login-form">
    <input type="email" name="correo" placeholder="Correo" required />
    <input type="password" name="password" placeholder="Contraseña" required />
    <button type="submit">Ingresar</button>
  </form>

  <p id="error" style="color:red; margin-top:10px;"></p>

  <button id="ir-registro" style="margin-top:15px;">
    Crear cuenta nueva
  </button>
</section>
`;

  const form = document.getElementById('login-form');
  const errorMsg = document.getElementById('error');
  const irRegistro = document.getElementById('ir-registro');

  // Ir al registro
  irRegistro.addEventListener('click', () => {
    mostrarRegistro();
  });

  // Enviar login
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    const correo = form.correo.value.trim();
    const password = form.password.value.trim();

    if (!correo || !password) {
      errorMsg.textContent = 'Por favor completa todos los campos.';
      return;
    }

    // Iniciar sesión en Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: password,
    });

    if (error) {
      errorMsg.textContent = 'Error al iniciar sesión: ' + error.message;
      return;
    }

    // Usuario autenticado correctamente
    console.log('Usuario logueado:', data.user);

    //  Recargar menú inferior (muy importante)
    await cargarMenu();

    //  Ir directo al feed "Para ti"
    mostrarMVP();
  });
}
