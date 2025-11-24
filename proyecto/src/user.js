import { supabase } from "./supabase.js";

export async function mostrarUser() {
  const app = document.getElementById("app");

  // Construcción del HTML principal
  app.innerHTML = `
<section>
    <h2>Mi Perfil</h2>

    <div id="perfil-cargando">Cargando perfil...</div>

    <form id="perfil-form" style="display:none;">
        <label>Handle (único – comienza con @)</label>
        <input type="text" id="handle" required />

        <label>Nombre (opcional)</label>
        <input type="text" id="nombre" />

        <p><small id="creado"></small></p>

        <button type="submit">Guardar cambios</button>
    </form>

    <p id="mensaje" style="margin-top:10px;"></p>
</section>
`;

  const form = document.getElementById("perfil-form");
  const mensaje = document.getElementById("mensaje");
  const creadoText = document.getElementById("creado");
  const handleInput = document.getElementById("handle");
  const nombreInput = document.getElementById("nombre");
  const loading = document.getElementById("perfil-cargando");

  // 1. Obtener usuario autenticado (Auth)
 
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    app.innerHTML = `<p>⚠ Debes iniciar sesión para ver tu perfil.</p>`;
    return;
  }

  const uid = user.id;

  // 2. Obtener datos del perfil en la tabla usuarios
  
  const { data: perfil, error: perfilError } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", uid)
    .single();

  if (perfilError) {
    loading.textContent = "❌ Error cargando perfil.";
    return;
  }

  // Mostrar datos en el formulario
  handleInput.value = perfil.handle || "";
  nombreInput.value = perfil.nombre || "";
  creadoText.textContent = "Cuenta creada el: " + new Date(perfil.creado_en).toLocaleString();

  loading.style.display = "none";
  form.style.display = "block";

  // 3. Guardar cambios
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    mensaje.textContent = "";

    const nuevoHandle = handleInput.value.trim();
    const nuevoNombre = nombreInput.value.trim() || null;

    // Validar handle
    if (!nuevoHandle.startsWith("@")) {
      mensaje.textContent = "⚠ El handle debe comenzar con @";
      return;
    }
    if (/\s/.test(nuevoHandle)) {
      mensaje.textContent = "⚠ El handle no puede tener espacios.";
      return;
    }

    // Verificar si el handle está disponible (si lo cambió)
    if (nuevoHandle !== perfil.handle) {
      const { data: existe } = await supabase
        .from("usuarios")
        .select("id")
        .eq("handle", nuevoHandle)
        .maybeSingle();

      if (existe) {
        mensaje.textContent = "⚠ Ese handle ya está en uso.";
        return;
      }
    }

    // Actualizar datos en Supabase
    const { error: updateError } = await supabase
      .from("usuarios")
      .update({ handle: nuevoHandle, nombre: nuevoNombre })
      .eq("id", uid);

    if (updateError) {
      mensaje.textContent = "❌ Error actualizando perfil: " + updateError.message;
      return;
    }

    mensaje.textContent = "✅ Perfil actualizado correctamente.";
  });
}

