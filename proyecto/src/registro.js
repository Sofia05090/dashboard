// src/registro.js
import { supabase } from './supabase.js';

export function mostrarRegistro() {
  const app = document.getElementById('app');
  app.innerHTML = `
<section>
  <h2>Registro</h2>
  <form id="registro-form">
    <input type="text" name="nombre" placeholder="Nombre (opcional)" />
    <input type="text" name="handle" placeholder="@tu_handle (obligatorio)" required />
    <input type="email" name="correo" placeholder="Correo" required />
    <input type="password" name="password" placeholder="Contraseña" required />
    <button type="submit">Registrarse</button>
  </form>
  <p id="error" style="color:red;"></p>
  <p id="info" style="color:green;"></p>
</section>
`;

  const form = document.getElementById('registro-form');
  const errorMsg = document.getElementById('error');
  const infoMsg = document.getElementById('info');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';
    infoMsg.textContent = '';

    const nombre = form.nombre.value.trim() || null;
    const handle = form.handle.value.trim();
    const correo = form.correo.value.trim();
    const password = form.password.value;

    // Validaciones básicas
    if (!handle || !correo || !password) {
      errorMsg.textContent = 'Por favor completa los campos obligatorios (handle, correo, contraseña).';
      return;
    }

    // Validar formato de handle: empezar con @ y sin espacios
    if (!handle.startsWith('@') || /\s/.test(handle)) {
      errorMsg.textContent = 'El handle debe comenzar por @ y no debe contener espacios (ejemplo: @juan23).';
      return;
    }

    // Comprobar unicidad del handle en la tabla "usuarios"
    try {
      const { data: existente, error: errCheck } = await supabase
        .from('usuarios')
        .select('id')
        .eq('handle', handle)
        .maybeSingle();

      if (errCheck) {
        console.error('Error al verificar handle:', errCheck);
        errorMsg.textContent = 'Error verificando el handle. Intenta más tarde.';
        return;
      }

      if (existente) {
        errorMsg.textContent = 'El handle ya está en uso. Elige otro.';
        return;
      }
    } catch (err) {
      console.error('Excepción verificando handle:', err);
      errorMsg.textContent = 'Error verificando el handle. Intenta más tarde.';
      return;
    }

    // 1) Crear usuario en Auth (Supabase)
    const { data: dataAuth, error: errorAuth } = await supabase.auth.signUp({
      email: correo,
      password: password,
    });

    if (errorAuth) {
      console.error('Error en signUp:', errorAuth);
      errorMsg.textContent = `Error en autenticación: ${errorAuth.message}`;
      return;
    }

    const uid = dataAuth.user?.id;
    if (!uid) {
      // En algunos setups el usuario puede no estar disponible inmediatamente (confirmación por correo).
      // Aún así intentamos obtener el id si está presente; si no, avisamos al usuario.
      errorMsg.textContent = 'Registro pendiente de confirmación por correo. Revisa tu email para verificar la cuenta.';
      return;
    }

    // 2) Insertar en tabla "usuarios"
    const { error: errorInsert } = await supabase.from('usuarios').insert([
      { id: uid, handle, nombre },
    ]);

    if (errorInsert) {
      console.error('Error al insertar en usuarios:', errorInsert);
      errorMsg.textContent = 'Error guardando datos del usuario: ' + errorInsert.message;
      // Nota: si la inserción falla por algún motivo (p. ej. constraint), el account en Auth puede existir.
      // Para limpieza completa podrías eliminar la cuenta desde el panel de Supabase o usar una función admin.
      return;
    }

    infoMsg.textContent = '✅ Registro exitoso. Revisa tu correo para confirmar la cuenta (si aplica).';
    form.reset();
  });
}
